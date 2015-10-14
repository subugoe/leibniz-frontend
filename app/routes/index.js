import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('letter', config.firstLetterID);
  }
});
