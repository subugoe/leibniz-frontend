import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  model: function(params) {
    return Ember.$.ajax({
      url: config.solrURL,
      data: {
        wt: 'json',
        q: 'id:' + params.letter_id
      },
      dataType: 'jsonp',
      jsonp: 'json.wrf'
    }).then(function(json) {
      var letter = {};
      if ( json.response.docs.length > 0 ) {
        letter = json.response.docs[0];
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
  afterModel: function() {
    Ember.run.next(() => {
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
