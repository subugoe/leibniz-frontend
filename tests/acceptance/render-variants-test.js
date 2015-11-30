import { test } from 'qunit';
import moduleForAcceptance from 'leibniz-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | render variants');

test('render variants', function(assert) {
  // Make sure this letter actually has variants
  visit('/letter/l3717');

  andThen(function() {
    var variantsCount = find('.variants .variant').length;
    var visibleVariantsCount = find('.variants .variant:visible').length;
    assert.ok(visibleVariantsCount === variantsCount, 'all variants should be visible');
  });
});
