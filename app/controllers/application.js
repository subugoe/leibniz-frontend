import Ember from 'ember';

export default Ember.Controller.extend({

  showNav: false,

  actions: {
    toggleNav() {
      this.set('showNav', ! this.get('showNav'));
    }
  }

});
