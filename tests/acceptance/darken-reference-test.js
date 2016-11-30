import { test } from 'qunit';
import moduleForAcceptance from 'leibniz-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | darken reference test');

test('darken reference', function(assert) {

    visit('/letter/l3681');
    // Make sure, variant is nested
    // Check if reference and decendants are all darkened

    var variantAvailable = 0;

    andThen(function () {
        variantAvailable = find('.variant[id="varc3681_15"]').length;
        assert.ok(variantAvailable > 0, 'variant available');
    });

    click('.variant[id="varc3681_15"]');

    // on command line, we need a timeout or colors haven't changed yet
    andThen(function () {
        window.setTimeout(checkColor, 1500);
    });

    var checkColor = () => {
        var accordingReference = '';
        var refColor = 'rgb(0, 0, 0)';
        accordingReference = find('.transcript .reference[data-id="varc3681_15"]');
        refColor = find(accordingReference).css('background-color');
        find(accordingReference).children().each(function (index, el) {
            var childColor = find(el).css('background-color');
            assert.ok(childColor === refColor, 'reference darkened to '+find(el).css('background-color')+', in accordance with '+refColor);
        });
    };
});