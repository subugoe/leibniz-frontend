import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'leibniz-frontend/tests/helpers/start-app';

module('Acceptance | header toggles', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('toggle metadata', function(assert) {
  assert.expect(4);
  visit('/letter/l371');

  click('button.header_toggle.-metadata');
  andThen( () => {
    assert.ok( find('.metadata').is(':visible'), 'metadata should become visible');
  });

  click('button.header_toggle.-metadata');
  andThen( () => {
    assert.ok( find('.metadata').is(':hidden'), 'metadata should be hidden again');
  });

  click('button.header_toggle.-citation');
  andThen( () => {
    assert.ok( find('.citation').is(':visible'), 'citation should become visible');
  });

  click('button.header_toggle.-citation');
  andThen( () => {
    assert.ok( find('.citation').is(':hidden'), 'citation should be hidden again');
  });
});
