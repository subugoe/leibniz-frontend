import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'lane -default',

  layoutName: function() {
    var lane = this.get('lane');
    return lane ? 'components/lane-' + lane.type : null;
  }.property('lane'),
  
  didInsertElement: function() {
    var $this = this.$()
    var lane = this.get('lane');
    if ( typeof lane !== 'undefined' && lane.hasOwnProperty('width') ) {
      $this.css({width: lane.width + '%'});
    }
  }
});
