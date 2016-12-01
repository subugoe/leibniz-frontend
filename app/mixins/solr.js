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
        reject(new Error('Invalid request or database offline'));
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
          hasVariants: ( ! ('textzeuge_aktiv' in letter) || letter.textzeuge_aktiv[index] ),
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

    // serveral rounds of replacing strings for big references to catch them all
    // possible structures: AA, ABBA, ABAB
    // 1: fish out all start references and store label in array
    // 2: create correct spans for all labels
    var referenceIDs = [];
    var regexStart = /<span class="start-reference -[a,c]footnote" data-id="([^"]+)".*?>/g;
    letter.volltext.replace(regexStart, function (str, dataID) {
      referenceIDs.push(dataID);
      return str;
    });

    // references can be nested. If they are started, but not ended within a string, they have to be escaped
    referenceIDs.forEach(function(elem) {
      var regex = '<span class="start-reference -([a,c]footnote)" data-id="'+elem+'"><\/span>(.*?)';
      regex += '<span class="end-reference -([a,c]footnote)" data-id="'+elem+'"><\/span>';
      regex = new RegExp(regex);
      letter.volltext = letter.volltext.replace(regex, function(str, type, text) {
        // if other references are started, but not ended, 
        // or ended but not started, within another string, they have to be escaped
        var countReg = /<span class="([^>]+)-reference -[a,c]footnote" data-id="([^"]+)"><\/span>/g;
        text.replace(countReg, function (countStr, countType, countID) {
          if (text.match(countID).length < 2) {
            var countRep = '</span><!-- unmatched start -->'+countStr+'<span class="reference -'+type+'" data-id="'+elem+'">';
            text = text.replace(countStr, countRep);
         }
         return text;
        });
        text = text.replace('</p>', '</span></p>');
        text = text.replace(/(<p[^>]*?>)/g, `$1<span class="reference -${type}" data-id="${elem}">`);
        text = text.replace(/(<table .*?tr[^>]*?>)/g, `</span>$1<span class="reference -${type}" data-id="${elem}">`);
        text = text.replace('</td>', '</span></td>');
        text = text.replace(/(<td [^>]*?>)/g, `$1<span class="reference -${type}" data-id="${elem}">`);
        text = '<span class="reference -'+type+'" data-id="'+elem+'">'+text;
        // Note: MathJax makes problems positioning elements, so there is another one positioned closely to bottom right of reference
        text += '<span class="svg-anchor">&nsbp;</span></span><!-- '+elem+' -->';
        return text;
      });
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
          variant.witnessesIndex = [];
          variant.textzeuge.forEach( function(elem, index) {
            variant.witnessesIndex[index] = letter.textzeuge_bezeichnung.indexOf(elem)+1;
          });
        } else {
          // Letter contains variants without textual witnesses
          letter.otherVariants = true;
        }
        variant.visible = true;
      });

      // convert encoding of references in variants
      letter.variants.forEach( function(variant) {

        // Convert XHTML to HTML5
        variant.text_schnipsel = Ember.$('<span/>', { html: variant.text_schnipsel }).html();

          var varRefsIDs = [];
          var varRegStart = /<span class="start-reference -[a,c]footnote" data-id="([^"]+)".*?>/g;
          variant.text_schnipsel.replace(varRegStart, function (str, varRefID) {
            varRefsIDs.push(varRefID);
            return str;
          });
          varRefsIDs.forEach(function(varID) {
            var regex = '<span class="start-reference -([a,c]footnote)" data-id="'+varID+'"><\/span>(.*?)';
            regex += '<span class="end-reference -([a,c]footnote)" data-id="'+varID+'"><\/span>';
            regex = new RegExp(regex);
            variant.text_schnipsel = variant.text_schnipsel.replace(regex, function(str, type, text) {
              // no nested references assumed
              text = text.replace('</p>', '</span></p>');
              text = text.replace(/(<p[^>]*?>)/g, `$1<span class="reference -${type}" data-id="${varID}">`);
              text = '<span class="reference -'+type+'" data-id="'+varID+'">'+text+'</span><!-- '+varID+' -->';
              return text;
            });
          });
      });

    }

    return letter;
  },
});
