import { test } from 'qunit';
import moduleForAcceptance from 'leibniz-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | toggle variants test');

// TODO: Make this test more elaborate
test('toggle variants', function(assert) {
  assert.expect(2);

  // Make sure this letter actually has variants
  visit('/letter/l3717');

  var variantsCount = 0
  var highlightsCount = 0

  // Highlight all variants
  click('.variants .variant');
  andThen(function() {
    variantsCount = find('.variants .variant:visible').length;
    highlightsCount = find('.transcript .reference.-highlight').length;
  })

  click('.variants .variants_button:first');
  andThen(function() {
    var visibleVariantsCount = find('.variants .variant:visible').length;
    var lessHighlightsCount = find('.transcript .reference.-highlight').length;
    assert.ok(visibleVariantsCount < variantsCount, 'less variants should be visible');
    assert.ok(lessHighlightsCount < highlightsCount, 'less references should be highlighted')
  });
});
