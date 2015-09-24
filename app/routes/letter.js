import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  model(params) {
    return Ember.$.ajax({
      url: config.solrURL,
      data: {'wt':'json', 'q':'id:' + params.letter_id},
      dataType: 'jsonp',
      jsonp: 'json.wrf'
    }).then(function(json) {
      var letter = {};
      if ( json.response.docs.length > 0 ) {
        letter = json.response.docs[0];
      } else {
        letter.id = params.letter_id;
      }
      return letter;
    });
  },

  renderTemplate() {
    this.render({ outlet: 'letter' });
  }
});
