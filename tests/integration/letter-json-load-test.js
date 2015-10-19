import Ember from "ember";
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
var App;

module('Integration | Letter JSON load test', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, App.destroy);
  }
});

test('Letter loaded and header rendered', function(assert) {
  assert.expect(4);
  // TODO: Workaround: Load a letter without fulltext or MathJax will make this test fail
  visit('/letter/l3746').then(function() {
    assert.ok(find('.header_sender .header_first-name').text().length > 0, 'Header contains sender\'s first name');
    assert.ok(find('.header_sender .header_last-name').text().length > 0, 'Header contains sender\'s last name');
    assert.ok(find('.header_recipient .header_first-name').text().length > 0, 'Header contains recipients\'s first name');
    assert.ok(find('.header_recipient .header_last-name').text().length > 0, 'Header contains recipients\'s last name');
  });
});
