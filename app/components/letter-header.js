import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  showCitation: false,
  showMetadata: false,
  tagName: '',
  texName: config.texName,
  actions: {
    changeLetter(id) {
      this.sendAction('changeLetter', id);
    },
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
