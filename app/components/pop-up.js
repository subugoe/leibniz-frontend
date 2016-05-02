import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'pop-up',
  tagName: 'span',
  didInsertElement() {
    var $this = this.$();
    $this.parent().css('position', 'relative');
    var newWidth = ( $this.outerHeight() + $this.outerWidth() ) / 2.5;
    if ( newWidth > $this.outerWidth() ) {
      $this.width(newWidth);
    }
    var right = Ember.$(window).width() - $this.offset().left - $this.outerWidth() - 10;
    if ( right < 0 ) {
      $this.width( $this.width() + right );
    }
  }
});
