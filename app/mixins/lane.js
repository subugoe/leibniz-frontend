import Ember from 'ember';
import Scrolling from './scrolling';

export default Ember.Mixin.create(Scrolling, {
  classNames: 'lane',
  classNameBindings: ['laneType'],
  tagName: 'section',
  laneType: Ember.computed( function() {
    var lane = this.get('lane');
    return lane ? this.get('lane').type : '';
  }),
  actions: {
    toggleLaneTypeDropdown() {
      this.$().find('.lane-type_dropdown').toggleClass('-open');
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
  },
  scrolled(scrollPos) {
    var headerHeight = this.$().offset().top + this.$('.lane-type').outerHeight();
    var scrolledBelowLaneHeader = ( scrollPos > headerHeight );
    this.$('.lane_actions').toggleClass('-fixed', scrolledBelowLaneHeader).css({
      top: scrollPos - headerHeight
    });
  }
});
