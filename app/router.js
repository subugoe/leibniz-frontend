import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('404', { path: '*path'});
  this.route('start', { path: '/start'});
  this.route('letter', { path: '/letter/:letter_id' });
  this.route('search');
});

export default Router;
