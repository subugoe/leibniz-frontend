import Ember from 'ember';
/* global $ */

export default Ember.Component.extend({
  classNames: 'drag-handle',
  mouseMove: function(event) {
    var dragHandlerHeight = 86; // as set in CSS
    this.$().css('background-position', `center ${event.offsetY - dragHandlerHeight / 2}px`);
  },
  mouseDown: function() {
    this.sendAction('beforeResize');
    var $this = this.$();
    var contentWidth = $('.content').outerWidth();
    $(window).on( 'mousemove', (event) => {
      var posX = event.pageX;
      if ( posX > 99 && posX < contentWidth - 99 ) {
        var $lane = $this.prev('.lane');
        $lane.css('width', (posX / contentWidth * 100) + '%' );
        $this.css('left', '');

      }
    });
    $(window).on( 'mouseup', () => {
      $(window).off('mousemove');
      this.sendAction('afterResize');
      // TODO: Save new state
    });
  }
});
