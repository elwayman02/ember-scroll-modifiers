import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import mockScrollIntoView from 'ember-scroll-modifiers/test-support/scroll-into-view-mock';

module(
  'Integration | Modifier | addon-test-support/scroll-into-view-mock',
  function (hooks) {
    setupRenderingTest(hooks);
    hooks.beforeEach(function () {
      this.mockHelperFunctions = mockScrollIntoView();
    });

    hooks.afterEach(function () {
      this.mockHelperFunctions.resetMock();
    });

    test('scroll into view returns correct parameters', async function (assert) {
      await render(
        hbs`<div {{scroll-into-view shouldScroll=true}} data-test-scroll-into-view-selector></div><div data-test-scroll-into-view-not-modified></div><div {{scroll-into-view shouldScroll=false}} data-test-scroll-into-view-not-scrolled></div>`
      );

      assert.ok(
        this.mockHelperFunctions.scrollIntoViewCalledWith(
          '[data-test-scroll-into-view-selector]'
        ),
        'ScrollIntoiViewCalledWith should return true for the given element selector'
      );
      assert.ok(
        this.mockHelperFunctions.scrollIntoViewCalledWith(
          find('[data-test-scroll-into-view-selector]'),
          'ScrollIntoiViewCalledWith should return true for the given element'
        )
      );
      assert.notOk(
        this.mockHelperFunctions.scrollIntoViewCalledWith(
          '[data-test-scroll-into-view-not-modified]',
          "ScrollIntoViewCalledWith should return false if the element doesn't have the modifier"
        )
      );
      assert.notOk(
        this.mockHelperFunctions.scrollIntoViewCalledWith(
          '[data-test-scroll-into-view-not-scrolled]',
          'ScrollIntoViewCalledWith should return false if the modifier was not triggered'
        )
      );
    });
  }
);
