import Ember from 'ember';

export default Ember.Component.extend({
  showMetadata: false,
  actions: {
    toggleMetadata: function() {
      Ember.$('.metadata').slideToggle();
      this.set('showMetadata', ! this.get('showMetadata'));
    }
  }
});
