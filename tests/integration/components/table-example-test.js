import { module, test } from 'qunit';
import { setupRenderingTest } from 'eai-cached-decorator-polyfill-reproduction/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | table-example', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<TableExample />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <TableExample>
        template block text
      </TableExample>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
