import { test } from 'qunit';
import moduleForAcceptance from 'leibniz-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | letter json load');

test('letter loaded and header rendered', function(assert) {

  // Make sure this letter actually exists
  visit('/letter/l3715').then(function() {
    assert.ok(find('.header_heading').text().length > 0, 'header contains correspondents\' names');
  });
});
