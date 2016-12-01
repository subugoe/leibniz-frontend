import { test } from 'qunit';
import moduleForAcceptance from 'leibniz-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | render child variants');

test('render variants', function(assert) {
    // Make sure this letter actually has child variants
    visit('/letter/l3715');

    andThen(function() {
        var variantContent = find('.variants').html().indexOf('start-reference');
        assert.ok(variantContent === -1, 'reference-tags in variants replaced');
    });

    andThen(function() {
        var variantVisible = find('.variant+.-child+.-visible');
        assert.ok(variantVisible.length > 0, 'child variant visible');
    })
});
