// Allow starting numerals with decimal point:
/* jshint -W008 */
import Ember from 'ember';
import Solr from '../mixins/solr';

export default Ember.Route.extend(Solr, {
  actions: {
    clearVariantConnectors() {
      this.clearVariantConnectors();
    },
    changeLetter(id) {
      this.transitionTo('letter', id);
    },
    positionVariants() {
      this.positionVariants();
    }
  },
  model(params) {
    var query = `id:${params.letter_id} OR (doc_id:${params.letter_id} AND type:variante)`;
    return this.query(query, {sort: 'type asc'}).then( (json) => {
      var letter = {};
      if ( typeof json.response === 'object' && json.response.docs.length > 0 ) {
        letter = this.parseResponse(json);
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
  renderTemplate() {
    var allLetters = this.controllerFor('application').get('model');
    var currentLetterId = this.get('controller.model.id');
    if ( allLetters ) {
      allLetters.forEach( (letter, index) => {
        if ( letter.id === currentLetterId ) {
          this.set('controller.model.prevLetter', index > 0 ? allLetters[index - 1] : null);
          this.set('controller.model.nextLetter', index < allLetters.length - 1 ? allLetters[index + 1] : null);
          return false;
        }
      });
      this.set('controller.model.allLetters', allLetters);
    }
    this.render();
    this.controller.set('rendered', false);
  },
  setupController(controller, model) {
    this._super(controller, model);
    var appController = this.controllerFor('application');
    appController.set('query', null);
    appController.set('showSearch', true);
    controller.set('rendered', true);
  },
  afterModel() {
    Ember.run.next( () => {
      this.activateLinks();

      var promises = [];

      promises.push( this.renderMathJax() );

      // Convert image references to SVG images
      Ember.$('.transcript, .variants').find('.reference.-image').each( (index, ref) => {
        var imageID = Ember.$(ref).data('id');
        promises.push(
          new Ember.RSVP.Promise( (resolve) => {
            this.loadSVG(imageID).then( function(svg) {
              Ember.$(ref).html(svg);
              resolve(true);
            });
          })
        );
      });

      // Position variants after MathJax has been rendered and images have been loaded
      Ember.RSVP.Promise.all(promises).then( () => {
        // TODO: For some reason, resize is always triggered once
        // this.positionVariants();

        // Store variant with MathJax and images to eliminate the need to re-run both
        // TODO: Would be nice if MathJax was able to render strings directly
        var variants = this.get('controller.model.variants');
        variants.forEach( function(variant) {
          Ember.set(variant, 'text_schnipsel', Ember.$('#' + variant.id + ' .variant_content').html());
        });

        Ember.$('.lane').resize( () => {
          Ember.run.debounce(this, this.clearVariantConnectors, 333, true);
          Ember.run.debounce(this, this.positionVariants, 333);
        });
        this.controller.set('rendered', true);
      });
    });
  },
  // Turn static links into ember transition links
  activateLinks() {
    var route = this;
    // TODO: Get <a> elements directly
    Ember.$('.metadata').find('a').not('[href^="http://"]').click( function(e) {
      e.preventDefault();
      var letterID = Ember.$(this).attr('href');
      route.transitionTo('letter', letterID);
    });
  },
  loadSVG(id) {
    return new Ember.RSVP.Promise( (resolve) => {
      this.query(`id:${id}`).then( function(json) {
        if ( json.response.docs.length > 0 && json.response.docs[0].hasOwnProperty('svg_code')) {
          resolve(json.response.docs[0].svg_code);
        }
      });
    });
  },
  renderMathJax() {
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
  clearVariantConnectors() {
    Ember.$('.content_svg-overlay').remove(); // TODO: Find a more elegant way to re-render SVG
  },
  positionVariants() {
    var $ = Ember.$;
    var $laneTranscript = $('.transcript');
    var $laneVariants = $('.variants');
    var $references = $laneTranscript.find('.reference');
    this.clearVariantConnectors();
    if ( $references.length === 0 ) {
      return;
    }

    var $laneHeader = $laneVariants.find('.lane_header');
    var $variants = $laneVariants.find('.variant');
    var $variantsArr = [];
    var marginBetweenVariants = parseInt( $laneVariants.css('line-height') ) / 2;
    var prevVariantBottom = $laneHeader.position().top + $laneHeader.outerHeight();
    // NOTE: Shorthand css properties like `padding` are not supported in Firefox

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
      if ( $.inArray(variantID, $variantsArr) !== -1) {
        return; // variant already defined
      }
      $variantsArr.push(variantID);

      var $variant = $variants.filter('#' + variantID);
      if ( $variant.length === 0 ) {
        return; // variant not available
      }
      var top = $this.position().top;
      var variantTop = (top < prevVariantBottom ? prevVariantBottom : top);
      $variant.css( {top: variantTop} ).addClass('-visible');

      // Add click handler to highlight reference/variant pair
      var $group = $this.add($references.filter(`[data-id=${variantID}]`)).add($variant);
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

      // Child variants / variants in variants
      var $childReferences = $variant.find('.reference.-afootnote, .reference.-cfootnote');
      $childReferences.each( function() {
        var childVariantID = $(this).data('id');
        var $childVariant = $variants.filter('#' + childVariantID);
        $childVariant.css( {top: prevVariantBottom} ).addClass('-child -visible');
        prevVariantBottom += $childVariant.outerHeight() + marginBetweenVariants;

        // Add click handler to highlight reference/variant pair
        var $childGroup = $(this).add($childReferences.filter(`[data-id=${childVariantID}]`)).add($childVariant);

        $childGroup.off('click').click( () => {
          $childGroup.toggleClass('-highlight');
          return false;
        });

        // NOTE: Cannot use toggleClass, see above
        $childGroup.hover( () => {
          $childGroup.addClass('-hover');
        }, () => {
          $childGroup.removeClass('-hover');
        });
      });

    });

    $laneVariants.height(prevVariantBottom);

    // Draw curved SVG-line from (last) reference to respective variant
    $('.variant').each( function() {
      var id = this.id;
      var reference = $('.transcript').find('.reference[data-id="'+id+'"]').last();
      var varReference = $('.variant').find('.reference[data-id="'+id+'"]').last();
      if (reference.length === 0 && varReference.length === 0) {
        return;
      }

      // Draw a curved line from reference to variant
      var path = document.createElementNS(svgNS, 'path');
      // NOTE: This provides an SVG-compatible rgb(...) color value
      var strokeColor = $(this).find('.variant_border0').css('border-left-color');
      path.setAttribute('stroke', strokeColor);
      path.setAttribute('fill', 'none');
      path.setAttribute('style', 'stroke-width: 1px');
      if (reference.length !== 0) {
        let left = reference.position().left;
        let bottom = reference.position().top + reference.outerHeight();
        // 14: padding right of .lane_content
        let pathD = `M ${left + 3}, ${bottom - .5}
                     L ${$laneTranscript.width() - 14}, ${bottom - .5}
                     C ${$laneTranscript.width()}, ${bottom - .5},
                       ${$laneTranscript.width()}, ${this.offsetTop + $(this).outerHeight() / 2 },
                       ${$(this).offset().left}, ${this.offsetTop + $(this).outerHeight() / 2 }`;
        path.setAttribute('d', pathD);
      } else {
        let startX = $laneVariants.position().left + varReference.closest('div').position().left + varReference.position().left;
        let startY = varReference.closest('div').position().top + varReference.position().top + varReference.innerHeight();
        let left = $laneVariants.position().left + 10;
        let endX = $(this).offset().left;
        let endY = this.offsetTop + $(this).outerHeight() / 2;
        let pathD = `M ${startX + 5}, ${startY - .5}
                     L ${left + 10}, ${startY - .5}
                     Q ${left}, ${startY - .5}, ${left}, ${startY + 10}
                     L ${left}, ${endY - 10}
                     Q ${left}, ${endY}, ${left + 10}, ${endY}
                     L  ${endX}, ${endY}`;
        path.setAttribute('d', pathD);
     }

      svg.appendChild(path);
    });
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
