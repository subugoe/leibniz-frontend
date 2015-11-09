import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['view'],
  laneTypes: [
    'scans',
    'transcript',
    'variants'
  ],
  view: '{"lanes":[{"type":"transcript","width":50},{"type":"variants"}]}'
});
