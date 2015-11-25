import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    Ember.$('.citation_input').click( function() {
        Ember.$(this).select();
    });
  }
});
