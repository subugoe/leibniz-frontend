import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import instanceInitializer from '../../../instance-initializers/ember-intl';

moduleForComponent('letter-citation', 'Integration | Component | letter citation', {
  integration: true,
  setup() {
    instanceInitializer.initialize(this);
    const intl = this.container.lookup('service:intl');
    intl.setLocale('de-de');
  }
});

test('it renders', function(assert) {
  this.render(hbs`{{letter-citation}}`);
  assert.ok(this.$().text().length > 0);
});
