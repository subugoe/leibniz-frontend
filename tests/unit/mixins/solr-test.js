import Ember from 'ember';
import SolrMixin from '../../../mixins/solr';
import { module, test } from 'qunit';

module('Unit | Mixin | solr');

// Replace this with your real tests.
test('it works', function(assert) {
  let SolrObject = Ember.Object.extend(SolrMixin);
  let subject = SolrObject.create();
  assert.ok(subject);
});
