import Ember from 'ember';

export default Ember.Component.extend({
  showCitation: false,
  showMetadata: false,
  actions: {
    toggleCitation() {
      Ember.$('.citation').slideToggle();
      this.set('showCitation', ! this.get('showCitation'));
    },
    toggleMetadata() {
      Ember.$('.metadata').slideToggle();
      this.set('showMetadata', ! this.get('showMetadata'));
    }
  }
});
