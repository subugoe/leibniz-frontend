import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'pop-up',
  tagName: 'span',
  didInsertElement() {
    var $this = this.$();
    var $parent = $this.parent();
    $parent.css('position', 'relative');
    if ( $parent.offset().left > 0.75 * Ember.$(window).width() ) {
      $this.addClass('-right');
    }
    var newMinWidth = $this.height();
    if ( newMinWidth > $this.width() ) {
      $this.css({ minWidth: newMinWidth });
    }
  }
});
