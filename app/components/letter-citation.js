import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    Ember.$('.citation_input').click( function() {
        Ember.$(this).select();
    });
  }
});
