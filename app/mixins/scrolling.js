import Ember from 'ember';

export default Ember.Mixin.create({
  init() {
    this._super(...arguments);
    var onScroll = () => {
      var scrollPos = Ember.$(window).scrollTop();
      return this.scrolled(scrollPos);
    };
    Ember.$(window).bind('scroll', onScroll);
    Ember.$(document).bind('touchmove', onScroll);
  },
  unbindScrolling() {
    Ember.$(window).unbind('scroll');
    Ember.$(document).unbind('touchmove');
  },
  scrolled(scrollPos) {
    // Modules using this component must implement a method called 'scrolled'
    return scrollPos;
  }
});
