import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    changeOrder(order) {
      this.set('order', order);
    }
  },
});
