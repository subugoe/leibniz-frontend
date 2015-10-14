import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  model: function(params) {
    return Ember.$.ajax({
      url: config.solrURL,
      data: {
        wt: 'json',
        q: `id:${params.letter_id} or (doc_id:${params.letter_id} and type:variante)`
      },
      dataType: 'jsonp',
      jsonp: 'json.wrf'
    }).then(function(json) {
      var letter = {};
      if ( json.response.docs.length > 0 ) {
        // TODO: Is letter always the first doc in response?
        letter = json.response.docs[0];
        letter.variants = json.response.docs.slice(1);
        // Add class prefix to all elements
        // NOTE: This only works for single class names
        letter.volltext = letter.volltext.replace(/class="([a-z0-9_-]+)"/g, 'class="letter_$1"');
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
      // Turn static links into ember transition links
      var route = this;
      // TODO: Get a elements directly
      Ember.$('.metadata').find('a').click( function(e) {
        e.preventDefault();
        var letterID = Ember.$(this).attr('href');
        route.transitionTo('letter', letterID);
      });

      // Render letter with MathJax
      if ( this.context.volltext ) {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub], () => { // jshint ignore:line
          this.controller.set('rendered', true);
        });
      } else {
        this.controller.set('rendered', true);
      }
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
