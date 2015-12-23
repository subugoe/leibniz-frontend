import Ember from 'ember';
import LaneMixin from '../../../mixins/lane';
import { module, test } from 'qunit';

module('Unit | Mixin | lane');

// Replace this with your real tests.
test('it works', function(assert) {
  let LaneObject = Ember.Object.extend(LaneMixin);
  let subject = LaneObject.create();
  assert.ok(subject);
});
