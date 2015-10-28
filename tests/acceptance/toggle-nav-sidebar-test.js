import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'leibniz-frontend/tests/helpers/start-app';

module('Acceptance | toggle nav sidebar', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('toggle nav sidebar', function(assert) {
  var navRight;
  assert.expect(2);

  // TODO: Workaround: Load a letter without fulltext or MathJax will make this test fail
  visit('/letter/l371');
  andThen( () => {
    navRight = find('.nav').css('right');
  });

  click('button.top-bar_toggle-nav');
  andThen( () => {
    assert.ok( find('.nav.-visible').css('right') === '0px', 'nav sidebar should become visible');
  });

  click('button.top-bar_toggle-nav');
  andThen( () => {
    assert.ok( find('.nav').css('right') === navRight, 'nav sidebar should be hidden again' );
  });
});
