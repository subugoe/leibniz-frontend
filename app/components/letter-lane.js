import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'lane',
  classNameBindings: ['laneType'],
  laneType: Ember.computed( function() {
    var lane = this.get('lane');
    return lane ? this.get('lane').type : '';
  }),
  layoutName: function() {
    var lane = this.get('lane');
    return lane ? 'components/lane-' + lane.type : null;
  }.property('lane'),
  didInsertElement: function() {
    var $this = this.$();
    var lane = this.get('lane');
    if ( typeof lane !== 'undefined' && lane.hasOwnProperty('width') ) {
      $this.css({width: lane.width + '%'});
    }
  }
});
