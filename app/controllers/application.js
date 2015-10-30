import Ember from 'ember';

export default Ember.Controller.extend({
  showNav: false,
  actions: {
    toggleNav: function() {
      this.set('showNav', ! this.get('showNav'));
      // Remove and redraw variant connectors
      this.send('beforeResize');
      Ember.$('.main').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', () => {
        this.send('afterResize');
      });
    }
  },
});
