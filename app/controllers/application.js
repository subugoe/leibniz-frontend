import config from '../config/environment';
import Ember from 'ember';
import Scrolling from '../mixins/scrolling';

export default Ember.Controller.extend(Scrolling, {
  baseURL: config.baseURL,
  showNav: false,
  showSearch: true,
  actions: {
    scrollToTop: function() {
      Ember.$('html, body').animate({scrollTop: 0});
    },
    search() {
      this.transitionToRoute('search', {queryParams: {query: this.query}});
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
