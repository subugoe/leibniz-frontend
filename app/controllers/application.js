import Ember from 'ember';

export default Ember.Controller.extend({
  showNav: false,
  actions: {
    toggleNav: function() {
      this.set('showNav', ! this.get('showNav'));

      // Remove and redraw variant connectors once animation is complete
      Ember.$('.content_svg-overlay').remove();
      Ember.$('.main').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', () => {
        Ember.$(window).resize(); // trigger variant connectores redraw
      });
    }
  },
});
