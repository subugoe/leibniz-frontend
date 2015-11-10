import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'lane',
  classNameBindings: ['laneType'],
  laneType: Ember.computed( function() {
    var lane = this.get('lane');
    return lane ? this.get('lane').type : '';
  }),
  actions: {
    toggleLaneTypeDropdown: function() {
      this.$().find('.lane-type-select_dropdown').toggleClass('-open');
    },
    changeLaneType: function() {
      // TODO
    }
  },
  didInsertElement: function() {
    var $this = this.$();
    var lane = this.get('lane');
    if ( typeof lane !== 'undefined' && lane.hasOwnProperty('width') ) {
      $this.css({width: lane.width + '%'});
    }
  }
});
