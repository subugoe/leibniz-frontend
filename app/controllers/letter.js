import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['view'],
  laneTypes: [
    'manuscript',
    'transcript',
    'variants'
  ],
  view: '{"lanes":[{"type":"transcript","width":50},{"type":"variants","width":50}]}'
});
