import { test } from 'qunit';
import moduleForAcceptance from 'leibniz-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | header toggles test');

test('toggle metadata', function(assert) {
  assert.expect(4);
  visit('/');

  click('button.header_toggle.-metadata');
  andThen( () => {
    assert.ok( find('.metadata').is(':visible'), 'metadata should become visible');
  });

  click('button.header_toggle.-metadata');
  andThen( () => {
    assert.ok( find('.metadata').is(':hidden'), 'metadata should be hidden again');
  });

  click('button.header_toggle.-citation');
  andThen( () => {
    assert.ok( find('.citation').is(':visible'), 'citation should become visible');
  });

  click('button.header_toggle.-citation');
  andThen( () => {
    assert.ok( find('.citation').is(':hidden'), 'citation should be hidden again');
  });
});
