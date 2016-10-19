import { test } from 'qunit';
import moduleForAcceptance from 'leibniz-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | toggle variants test');

// TODO: Make this test more elaborate
test('toggle variants', function(assert) {
  assert.expect(3);

  // Make sure this letter actually has variants with formulas and images
  visit('/letter/l37134');

  var variantsCount = 0
  var highlightsCount = 0

  andThen(function() {
    variantsCount = find('.variants .variant:visible').length;
  });

  // Highlight all variants
  click('.variants .variant');
  andThen(function () {
    highlightsCount = find('.transcript .reference.-highlight').length;
  });

  click('.variants .variants_button');
  andThen(function() {
    var visibleVariantsCount = find('.variants .variant:visible').length;
    var lessHighlightsCount = find('.transcript .reference.-highlight').length;
    assert.ok(visibleVariantsCount < variantsCount, 'less variants should be visible');
    assert.ok(lessHighlightsCount < highlightsCount, 'less references should be highlighted')
  });

  // Restore all variants, check images
  // NOTE: MathJax is disabled in test environment for performance reasons, so MathJax-rendered
  // content cannot checked. Yet, if SVG is present, so should MathJax.
  click('.variants .variants_button');
  andThen(function() {
    var imagesCount = find('.variants .reference.-image svg').length;
    assert.ok(imagesCount > 0, 'SVG images should still be present');
  });
});
