import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-split-view/child/close-button', 'Integration | Component | ember split view/child/close button', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ember-split-view/child/close-button}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ember-split-view/child/close-button}}
      template block text
    {{/ember-split-view/child/close-button}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
