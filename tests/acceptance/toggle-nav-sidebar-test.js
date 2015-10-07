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
  var nav, navRight, duration;
  assert.expect(2);

  // TODO: Workaround: Load a letter without fulltext or MathJax will make this test fail
  visit('/letter/l371');
  andThen( () => {
    nav = find('.nav');
    navRight = nav.css('right');
    // FIXME: Double time to make sure animation is finished even when laggy
    duration = parseInt( parseFloat(nav.css('transition-duration')) * 2 * 1000 );
  });

  click('button.top-bar_toggle-nav');
  andThen( () => {
    var done = assert.async();
    setTimeout( () => {
      assert.ok( find('.nav.-visible').css('right') === '0px', 'nav sidebar should become visible');
      done();

      click('button.top-bar_toggle-nav');
      andThen( () => {
        var done2 = assert.async();
        setTimeout( () => {
          assert.ok( nav.css('right') === navRight, 'nav sidebar should be hidden again' );
          done2();
        }, duration );
      });
    }, duration );
  });
});
