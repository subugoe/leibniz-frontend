import { test } from 'qunit';
import moduleForAcceptance from 'leibniz-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | toggle variants test');

// TODO: Make this test more elaborate
test('toggle variants', function(assert) {
  // Make sure this letter actually has variants
  visit('/letter/l3717');

  var variantsCount = 0
  andThen(function() {
    variantsCount = find('.variants .variant:visible').length;
  })

  click('.variants .variants_button:first');
  andThen(function() {
    var visibleVariants = find('.variants .variant:visible').length;
    assert.ok(visibleVariants < variantsCount, 'some variants should be hidden');
  });
});
