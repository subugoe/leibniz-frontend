import Ember from 'ember';
import Scrolling from '../mixins/scrolling';

export default Ember.Controller.extend(Scrolling, {
  showNav: false,
  actions: {
    scrollToTop: function() {
      Ember.$('html, body').animate({scrollTop: 0});
    },
    toggleNav: function() {
      this.set('showNav', ! this.get('showNav'));
    }
  },
  scrolled: function(scrollPos) {
    var scrolledBelowHeader = ( scrollPos > 99 );
    Ember.$('.main_scroll-top').toggleClass('-visible', scrolledBelowHeader);
  }
});
