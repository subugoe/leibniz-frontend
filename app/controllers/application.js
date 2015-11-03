import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    toggleNav: function() {
      this.set('showNav', ! this.get('showNav'));
    }
  },
  showNav: false
});
