import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    query: {
      replace: true // TODO: This should prevent creation of a new history event for every changed letter, but does not. Why?
    },
    order: {
      replace: true
    }
  },
  order: 'reihe asc, band asc, brief_nummer asc',
  actions: {
    changeOrder(order) {
      this.set('order', order);
      this.get('target.router').refresh();
    }
  },
});
