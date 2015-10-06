import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'popup',
  tagName: 'span',
  didInsertElement: function() {
    var $this = this.$()
    if ( this.get('wide') ) {
      $this.addClass('-wide');
    }
    var $parent = $this.parent()
    $parent.addClass('popup_parent');
    if ( $parent.offset().left > 0.75 * Ember.$(window).width() ) {
      $this.addClass('-right');
    }
  }
});
