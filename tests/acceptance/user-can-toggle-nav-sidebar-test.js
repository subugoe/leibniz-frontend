import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'leibniz-frontend/tests/helpers/start-app';

module('Acceptance | user can toggle nav sidebar', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('toggle nav sidebar', function(assert) {
  assert.expect(2);
  visit('/');

  var nav, navRight, duration;
  andThen(function() {
    nav = find('.nav');
    navRight = nav.css('right');
    // FIXME: Double time to make sure animation is finished even when laggy
    duration = parseInt( parseFloat(nav.css('transition-duration')) * 2 * 1000 );
  })

  click('button.top-bar_toggle-nav');

  andThen(function() {
    var done = assert.async();

    setTimeout( function() {
      assert.ok( nav.css('right') === '0px', 'nav sidebar should become visible');
      done();

      click('button.top-bar_toggle-nav');

      andThen(function() {
        var done = assert.async();

        setTimeout( function() {
          assert.ok( nav.css('right') === navRight, 'nav sidebar should be hidden again' );
          done();
        }, duration );
      });

    }, duration );
  });
});
