import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  beforeModel() {
    this.transitionTo('letter', config.firstLetterID);
  }
});
