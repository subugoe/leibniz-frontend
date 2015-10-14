import { ucFirst } from '../../../helpers/uc-first';
import { module, test } from 'qunit';

module('Unit | Helper | uc first');

// Replace this with your real tests.
test('first character of every world is transformed to uppercase', function(assert) {
  var result = ucFirst(['lorem ipsum dolor sit amet']);
  assert.equal(result, 'Lorem Ipsum Dolor Sit Amet');
});
