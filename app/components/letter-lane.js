import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'lane',
  classNameBindings: ['laneType'],
  laneType: Ember.computed( function() {
    var lane = this.get('lane');
    return lane ? this.get('lane').type : '';
  }),
  actions: {
    toggleLaneTypeDropdown() {
      this.$().find('.select-lane-type_dropdown').toggleClass('-open');
    },
    changeLaneType() {
      // TODO
    },
    positionVariants() {
      this.sendAction('positionVariants');
    }
  },
  didInsertElement() {
    var $this = this.$();
    var lane = this.get('lane');
    if ( typeof lane !== 'undefined' && lane.hasOwnProperty('width') ) {
      $this.css({width: lane.width + '%'});
    }
  }
});
