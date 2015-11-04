import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'pop-up',
  tagName: 'span',
  didInsertElement: function() {
    var $this = this.$();
    var $parent = $this.parent();
    $parent.css('position', 'relative');
    if ( $parent.offset().left > 0.75 * Ember.$(window).width() ) {
      $this.addClass('-right');
    }
  }
});
