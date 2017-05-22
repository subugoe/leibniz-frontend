import { test } from 'qunit';
import moduleForAcceptance from 'leibniz-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | toggle nav sidebar test');

test('toggle nav sidebar', function(assert) {
  var navRight;
  assert.expect(2);

  // Make sure this letter actually exists
  visit('/letter/l3715');

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
