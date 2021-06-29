import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupScrollIntoView from 'ember-scroll-modifiers/test-support/scroll-into-view-mock';

module(
  'Integration | Modifier | addon-test-support/scroll-into-view-mock',
  function (hooks) {
    setupRenderingTest(hooks);
    setupScrollIntoView(hooks);
    test('scroll into view returns correct parameters', async function (assert) {
      await render(
        hbs`<div {{scroll-into-view shouldScroll=true}} data-test-scroll-into-view-selector></div>`
      );

      assert.ok(
        this.scrollIntoViewCalledWith('[data-test-scroll-into-view-selector]')
      );
      assert.ok(
        this.scrollIntoViewCalledWith(
          find('[data-test-scroll-into-view-selector]')
        )
      );
    });
  }
);
