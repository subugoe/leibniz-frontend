import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['view'],
  view: '{"lanes":[{"type":"transcript","width":50},{"type":"variants"}]}'
});
