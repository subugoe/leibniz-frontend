import { test } from 'qunit';
import moduleForAcceptance from 'leibniz-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | search');

test('visiting /search', function(assert) {
  assert.expect(3);

  visit('/search');
  andThen(function() {
    assert.equal(currentURL(), '/search');
  });

  // Make sure the search term does return at least 2, but not to many results for performance reasons
  fillIn('.search_input', 'sigil');
  andThen(function() {
    assert.ok(find('.search_result').length > 0, 'At least one result was found');
  });

  fillIn('.search_order', 'datum_gregorianisch desc');
  andThen(function() {
    var passed = true;
    var dates = find('.search_date');
    dates.each(function(index) {
      if (index === 0) {
        return true;
      }
      // Letters should be sorted by dates descending.
      // Fail if the current datetime is bigger than the preceding one.
      if (this.getAttribute('datetime') > dates[index - 1].getAttribute('datetime')) {
        passed = false;
      }
    });
    assert.equal(passed, true, 'Results should be sorted by date descending');
  });
});
