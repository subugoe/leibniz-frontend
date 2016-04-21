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
    var query = `id:${params.letter_id} or (doc_id:${params.letter_id} and type:variante)`;
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
    allLetters.forEach( (letter, index) => {
      if ( letter.id === currentLetterId ) {
        this.set('controller.model.prevLetter', index > 0 ? allLetters[index - 1] : null);
        this.set('controller.model.nextLetter', index < allLetters.length - 1 ? allLetters[index + 1] : null);
        return false;
      }
    });
    this.set('controller.model.allLetters', allLetters);
    this.render();
    this.controller.set('rendered', false);
  },
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('rendered', true);
  },
  afterModel() {
    var $ = Ember.$;

    Ember.run.next( () => {
      this.activateLinks();

      // Add bibliographic info popups
      $('.metadata').find('.reference.-biblio').each( (index, ref) => {
        var id = $(ref).data('href');
        this.loadBiblio(id).then( function(html) {
          // TODO: This is not an instance of "pop-up" component, but merely
          // a dumb DOM node with he same class name. Therefore, position and
          // size are not adjusted automatically.
          var $popup = $('<span class="pop-up -wide -right"/>');
          $popup.html(html);
          $(ref).css('position', 'relative').append($popup);
        });
      });

      // Convert image references to SVG images
      $('.transcript, .variants').find('.reference.-image').each( (index, ref) => {
        var id = $(ref).data('id');
        this.loadSVG(id).then( function(svg) {
          $(ref).html(svg);
        });
      });

      // Render MathJax, then position variants
      this.renderMathJax().then( () => {
        // TODO: For some reason, resize is always triggered once
        // this.positionVariants();
        $('.lane').resize( () => {
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
  loadBiblio(id) {
    return new Ember.RSVP.Promise( (resolve) => {
      this.query(`id:${id}`).then( function(json) {
        if ( json.response.docs.length > 0 && json.response.docs[0].hasOwnProperty('bibliographische_angabe') ) {
          resolve(json.response.docs[0].bibliographische_angabe);
        }
      });
    });
  },
  loadSVG(id) {
    return new Ember.RSVP.Promise( (resolve) => {
      this.query(`id:${id}`).then( function(json) {
        if ( json.response.docs.length > 0 && json.response.docs[0].hasOwnProperty('svg_code') ) {
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
    var $transcriptLane = $('.transcript');
    var $references = $transcriptLane.find('.reference.-afootnote, .reference.-cfootnote');

    this.clearVariantConnectors();
    if ( $references.length === 0 ) {
      return;
    }

    var $variantsLane = $('.variants');
    var $laneHeader = $variantsLane.find('.lane_header');
    var $variants = $variantsLane.find('.variant');
    var marginBetweenVariants = parseInt( $variantsLane.css('line-height') ) / 2;
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
      var $variant = $variants.filter('#' + variantID);
      if ( $variant.length === 0 ) {
        return; // no variant with this ID
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
      // 14: padding right of .lane_content
      var pathD = `M ${left + 3}, ${bottom - .5}
                   L ${$transcriptLane.width() - 14}, ${bottom - .5}
                   C ${$transcriptLane.width()}, ${bottom - .5},
                     ${$transcriptLane.width()}, ${variantTop + $variant.outerHeight() / 2 - .5},
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

      // TODO: Child variants / variants in variants
      var $childReferences = $variant.find('.reference.-afootnote, .reference.-cfootnote');
      $childReferences.each( function() {
        var childVariantID = $(this).data('id');
        var $childVariant = $variants.filter('#' + childVariantID);
        $childVariant.css( {top: prevVariantBottom, marginLeft: '30px' /* TODO: use class instead */} ).addClass('-visible');
        prevVariantBottom += $childVariant.outerHeight() + marginBetweenVariants;
      });
    });

    $variantsLane.height(prevVariantBottom);
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
