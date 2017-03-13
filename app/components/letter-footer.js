import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  showCitation: false,
  showMetadata: false,
  tagName: '',
  texName: config.texName
});
