// Allow starting numerals with decimal point:
/* jshint -W008 */
import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  actions: {
    clearVariantConnectors: function() {
      this.clearVariantConnectors();
    },
    positionVariants: function() {
      this.positionVariants();
    }
  },
  model: function(params) {
    var query = `id:${params.letter_id} or (doc_id:${params.letter_id} and type:variante)`;
    return this.solrQuery(query).then( (json) => {
      var letter = {};
      if ( typeof json.response === 'object' && json.response.docs.length > 0 ) {
        letter = this.parseSolrResponse(json);
      } else {
        letter.id = params.letter_id;
      }

      // NOTE: query-params can only use this string if it is correctly URL-encoded
      letter.viewQuery = params.view;
      try {
        letter.view = Ember.$.parseJSON(params.view);
      } catch (e) {
        letter.view = null;
      }

      return letter;
    }, function(error) {
      return {error};
    });
  },
  solrQuery: function(query) {
    // TODO: JSONP does not allow error handling. For now, just assume the
    // request failed if there is no response within 3 seconds.
    return new Ember.RSVP.Promise( function(resolve, reject){
      Ember.$.ajax({
        data: {
          q: query,
          rows: 9999,
          wt: 'json'
        },
        dataType: 'jsonp',
        jsonp: 'json.wrf',
        url: config.solrURL,
        timeout: 3000
      }).done( function(data) {
        resolve(data);
      }).error( function() {
        reject(new Error('Solr request timed out'));
      });
    });
  },
  parseSolrResponse: function(json) {
    // TODO: Is letter always the first doc in response?
    var letter = json.response.docs[0];
    letter.bothDatesPresent = letter.datum_julianisch && letter.datum_gregorianisch;
    letter.dateAddedByEditor = letter.datum_anzeige.indexOf('[') > -1;
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
    if ( 'beilage_brief_link' in letter ) {
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
          variant.textzeuge[0] = variant.textzeuge[0].trim(); // TODO: Remove this once Solr is cleaned
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
  renderTemplate: function() {
    this.render({ outlet: 'letter' });
    this.controller.set('rendered', false);
  },
  setupController: function (controller, model) {
    this._super(controller, model);
    controller.set('rendered', true);
  },
  afterModel: function() {
    Ember.run.next( () => {
      this.activateLinks();

      // Convert image references to SVG images
      Ember.$('.transcript').find('.reference.-image').each( (index, ref) => {
        var imageID = Ember.$(ref).data('id');
        this.loadSVG(imageID).then( function(svg) {
          Ember.$(ref).html(svg);
        });
      });

      // Render MathJax, then position variants
      this.renderMathJax().then( () => {
        // TODO: For some reason, resize is always triggered once
        // this.positionVariants();
        Ember.$('.lane').resize( () => {
          Ember.run.debounce(this, this.clearVariantConnectors, 333, true);
          Ember.run.debounce(this, this.positionVariants, 333);
        });
        this.controller.set('rendered', true);
      });
    });
  },
  // Turn static links into ember transition links
  activateLinks: function() {
    var route = this;
    // TODO: Get <a> elements directly
    Ember.$('.metadata').find('a').not('[href^="http://"]').click( function(e) {
      e.preventDefault();
      var letterID = Ember.$(this).attr('href');
      route.transitionTo('letter', letterID);
    });
  },
  loadSVG: function(id) {
    return new Ember.RSVP.Promise( (resolve) => {
      this.solrQuery(`id:${id}`).then( function(json) {
        if ( json.response.docs.length > 0 && json.response.docs[0].hasOwnProperty('svg_code')) {
          resolve(json.response.docs[0].svg_code);
        }
      });
    });
  },
  renderMathJax: function() {
    var context = this.context;
    return new Ember.RSVP.Promise( (resolve) => {
      if ( context.volltext && typeof MathJax !== 'undefined' ) {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub], () => {
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  },
  clearVariantConnectors: function() {
    Ember.$('.content_svg-overlay').remove(); // TODO: Find a more elegant way to re-render SVG
  },
  positionVariants: function() {
    var $ = Ember.$;
    var $laneTranscript = $('.transcript');
    var $references = $laneTranscript.find('.reference');

    this.clearVariantConnectors();
    if ( $references.length === 0 ) {
      return;
    }

    var $laneVariants = $('.variants');
    var $actionsBlock = $laneVariants.find('.lane_actions');
    var $variants = $laneVariants.find('.variant');
    var prevVariantBottom = $actionsBlock.position().top + $actionsBlock.outerHeight();
    // NOTE: Shorthand css properties like `padding` are not supported in Firefox
    var marginBetweenVariants = parseInt( $laneVariants.css('line-height') ) / 2;

    // Using plain JS for SVG since jQuery struggles with namespaces
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'content_svg-overlay');
    svg.setAttribute('width', $('.content').width());
    svg.setAttribute('height', $('.content').height());
    document.getElementById('content').appendChild(svg);

    $references.each( function() {
      var $this = $(this);
      var variantID = $this.data('id');
      var $variant = $variants.filter('#' + variantID);
      if ( $variant.length === 0 ) {
        return; // variant not available
      }
      var left = $this.position().left;
      var top = $this.position().top;
      var bottom = $this.position().top + $this.outerHeight();

      var variantTop = (top < prevVariantBottom ? prevVariantBottom : top);
      $variant.css( {top: variantTop} ).addClass('-visible');

      // Draw a curved line from reference to variant
      var path = document.createElementNS(svgNS, 'path');
      // NOTE: This provides an SVG-compatible rgb(...) color value
      var strokeColor = $variant.css('border-left-color');
      path.setAttribute('stroke', strokeColor);
      path.setAttribute('fill', 'none');
      path.setAttribute('style', 'stroke-width: 1px');
      var pathD = `M ${left + 3}, ${bottom - .5}
                   L ${$laneTranscript.width()}, ${bottom - .5}
                   C ${$laneTranscript.width() + 21}, ${bottom - .5},
                     ${$laneTranscript.width() + 21}, ${variantTop + $variant.outerHeight() / 2 - .5},
                     ${$variant.offset().left}, ${variantTop + $variant.outerHeight() / 2 - .5}`;
      path.setAttribute('d', pathD);
      svg.appendChild(path);

      // Add click handler to highlight reference/variant pair
      var $group = $this.add($references.filter(`[data-ref-id=${variantID}]`)).add($variant);
      $group.off('click').click( () => {
        $group.toggleClass('-highlight');
        return false;
      });

      // NOTE: Cannot use toggleClass because element can be moved under the
      // mouse pointer which does not trigger mouseEnter
      $group.hover( () => {
        $group.addClass('-hover');
      }, () => {
        $group.removeClass('-hover');
      });

      prevVariantBottom = variantTop + $variant.outerHeight() + marginBetweenVariants;
    });

    $laneVariants.height(prevVariantBottom);
  }
});

/* global MathJax */
if ( typeof MathJax !== 'undefined' ) {
  MathJax.Hub.Config({
    extensions: ['tex2jax.js'],
    'HTML-CSS': {
      availableFonts: ['TeX']
    },
    jax: ['input/TeX', 'output/HTML-CSS'],
    styles: { '#MathJax_Message': { display: 'none' }},
    tex2jax: {
      inlineMath: [ ['$', '$'], ['\\(', '\\)'] ],
      displayMath: [ ['$$', '$$'], ['\\[', '\\]'] ],
      processEscapes: true
    }
  });
}
