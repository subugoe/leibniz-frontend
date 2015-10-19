// Allow starting numerals with decimal point
/*jshint -W008 */
import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  model: function(params) {
    return Ember.$.ajax({
      url: config.solrURL,
      data: {
        wt: 'json',
        q: `id:${params.letter_id} or (doc_id:${params.letter_id} and type:variante)`,
        rows: 9999
      },
      dataType: 'jsonp',
      jsonp: 'json.wrf'
    }).then( function(json) {
      var letter = {};
      if ( json.response.docs.length > 0 ) {
        // TODO: Is letter always the first doc in response?
        letter = json.response.docs[0];
        letter.volltext = letter.volltext;
        letter.variants = json.response.docs.slice(1);
        // Determine variant type from ID
        // TODO: Would be nice to use for ( ... of ... ) here, but breaks tests
        letter.variants.forEach( function(variant) {
          var typeHint = variant.id.substr(0, 4);
          switch ( typeHint ) {
            case 'vara':
              variant.type = 'addition';
              break;
            case 'varc':
              variant.type = 'variant';
              break;
          }
        });
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
    });
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
        this.positionVariants();
        Ember.$(window).resize( () => this.positionVariants() );
        this.controller.set('rendered', true);
      });
    });
  },
  // Turn static links into ember transition links
  activateLinks: function() {
    var route = this;
    // TODO: Get a elements directly
    Ember.$('.metadata').find('a').click( function(e) {
      e.preventDefault();
      var letterID = Ember.$(this).attr('href');
      route.transitionTo('letter', letterID);
    });
  },
  loadSVG: function(id) {
    return new Ember.RSVP.Promise( function(resolve) {
      Ember.$.ajax({
        url: config.solrURL,
        data: {
          wt: 'json',
          q: `id:${id}`
        },
        dataType: 'jsonp',
        jsonp: 'json.wrf'
      }).then( function(json) {
        if ( json.response.docs.length > 0 && json.response.docs[0].hasOwnProperty('svg_code')) {
          resolve(json.response.docs[0].svg_code);
        }
      });
    });
  },
  renderMathJax: function() {
    var context = this.context;
    return new Ember.RSVP.Promise( function(resolve) {
      if ( context.volltext ) {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub], () => { // jshint ignore:line
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  },
  positionVariants: function() {
    var $ = Ember.$;
    $('.content_svg-overlay').remove(); // TODO: Find a more elegant way to re-render SVG
    var $laneTranscript = $('.transcript');
    var $laneVariants = $('.variants');
    var $references = $laneTranscript.find('.reference.-afootnote, .reference.-cfootnote');

    if ( $references.length === 0 ) {
      return;
    }

    var $variants = $laneVariants.find('.variant').hide();
    var prevVariantBottom = 0;
    var marginBetweenVariants = parseInt( $laneVariants.css('padding') );

    // Using plain JS for SVG since jQuery struggles with namespaces
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'content_svg-overlay');
    svg.setAttribute('width', $('.content').width());
    svg.setAttribute('height', $('.content').height());
    document.getElementsByClassName('content')[0].appendChild(svg);

    $references.each( function() {
      var $this = $(this);
      var variantID = $this.data('id');
      var $variant = $variants.filter('#' + variantID).show();
      if ( $variant.length === 0 ) {
        return; // variant not available
      }
      var left = $this.position().left;
      var top = $this.position().top;
      var bottom = $this.position().top + $this.outerHeight();
      var variantTop = (top < prevVariantBottom ? prevVariantBottom : top + 10); // TODO: Calucalte this value
      prevVariantBottom = variantTop + $variant.outerHeight() + marginBetweenVariants;
      $variant.css( {top: variantTop} );

      // Draw a curved line from reference to variant
      var path = document.createElementNS(svgNS, 'path');
      path.setAttribute('stroke', '#aaaaaa');
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
      $this.add($variant).click( () => {
        $this.add($variant).toggleClass('-highlight');
        return false;
      });

      // NOTE: Cannot use toggleClass because element can be moved under the
      // mouse pointer which does not trigger mouseEnter
      $this.add($variant).hover( () => {
        $this.add($variant).addClass('-hover');
      }, () => {
        $this.add($variant).removeClass('-hover');
      });
    });
  }
});

// jshint ignore:start
MathJax.Hub.Config({
  extensions: ['tex2jax.js'],
  jax: ['input/TeX', 'output/HTML-CSS'],
  tex2jax: {
    inlineMath: [ ['$', '$'], ['\\(', '\\)'] ],
    displayMath: [ ['$$', '$$'], ['\\[', '\\]'] ],
    processEscapes: true
  },
  'HTML-CSS': {
    availableFonts: ['TeX']
  }
});
// jshint ignore:end
