import Ember from 'ember';
import config from '../config/environment';

export default Ember.Mixin.create({
  query(query, options = {}) {
    return new Ember.RSVP.Promise( function(resolve, reject){
      options.q = query;
      options.rows = 9999;
      options.wt = 'json';
      Ember.$.getJSON(config.solrURL, options).done( function(data) {
        resolve(data);
      }).error( function() {
        reject(new Error('Database offline'));
      });
    });
  },
  parseResponse(json) {
    // TODO: This only works because we sort by type and "brief" comes before "variant"
    var letter = json.response.docs[0];
    letter.bothDatesPresent = letter.datum_julianisch && letter.datum_gregorianisch;
    letter.dateAddedByEditor = letter.datum_anzeige && letter.datum_anzeige.indexOf('[') > -1;
    letter.exactDateUnknown = letter.datum_julianisch_bis;
    letter.variants = json.response.docs.slice(1);

    // Merge 'textzeuge' arrays
    if ( 'textzeuge_bezeichnung' in letter ) {
      letter.witnesses = [];
      letter.textzeuge_bezeichnung.forEach( function(textzeuge, index) {
        // Use 1-based index for easier Sass and Handlebars handling
        letter.witnesses[index + 1] = {
          identifier: textzeuge,
          type: letter.textzeuge_art[index],
          text: letter.textzeuge_text[index],
          visible: true
        };
      });
    }
    // TODO: Would be much nicer if Solr delivered ID and number separated here to begin with
    if ( 'beilage_link' in letter ) {
      // Letter has an attachment
      letter.attachment = {};
      for ( let link of letter.beilage_link ) {
        let $link = Ember.$(link);
        letter.attachment.id = $link.attr('href');
        letter.attachment.number = $link.text();
      }
    }
    if ( 'beilage_brief_link' in letter ) {
      // Letter is an attachment itself
      letter.attachmentToLetters = [];
      for ( let link of letter.beilage_brief_link ) {
        let $link = Ember.$(link);
        let parentLetter = {};
        parentLetter.id = $link.attr('href');
        parentLetter.number = $link.text();
        letter.attachmentToLetters.push( parentLetter );
      }
    }

    // Convert XHTML to HTML5
    letter.volltext = Ember.$('<div/>', { html: letter.volltext }).html();

    var regex = /<span class="[^"]*start-reference.+?data-id="([^"]+)".*?><\/span>(.*?)<span class="[^"]*end-reference[^>]*><\/span>/g;
    letter.volltext = letter.volltext.replace(regex, function (str, id, text) {
      // Append every <p>, prepend every </p> with reference span using a
      // different data attribute for non-linked parts of this reference
      text = text.replace('</p>', '</span></p>');
      text = text.replace(/(<p[^>]*>)/g, `$1<span class="reference" data-ref-id="${id}">`);
      text = `<span class="reference" data-ref-id="${id}">${text}</span>`;
      // Replace last dummy with actual reference
      var lastDataIndex = text.lastIndexOf('data-ref-id');
      text = text.substr(0, lastDataIndex) + 'data-id' + text.substr(lastDataIndex + 'data-ref-id'.length);
      return text;
    });

    // Determine variant types from IDs
    if ( 'variants' in letter ) {
      letter.variants.forEach( function(variant) {
        var typeHint = variant.id.substr(0, 4);
        switch ( typeHint ) {
          case 'vara':
            variant.type = 'note';
            break;
          case 'varc':
            variant.type = 'variant';
            break;
        }
        if ( variant.textzeuge && letter.textzeuge_bezeichnung ) {
          var witnessIdentifier = variant.textzeuge[0];
          variant.witnessIndex = letter.textzeuge_bezeichnung.indexOf(witnessIdentifier) + 1;
        } else {
          // Letter contains variants without textual witnesses
          letter.otherVariants = true;
        }
        variant.visible = true;
      });
    }

    return letter;
  },
});
