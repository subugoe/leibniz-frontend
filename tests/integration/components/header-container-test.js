import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import instanceInitializer from '../../../instance-initializers/ember-intl';

moduleForComponent('header-container', 'Integration | Component | header container', {
  integration: true,
  setup() {
    instanceInitializer.initialize(this);
    const intl = this.container.lookup('service:intl');
    intl.setLocale('de-de');
  }
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{header-container}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#header-container}}
      template block text
    {{/header-container}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
