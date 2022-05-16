import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import mockScrollTo from 'ember-scroll-modifiers/test-support/scroll-to-element-with-offset-mock';

module(
  'Integration | Modifier | addon-test-support/scroll-to-element-with-offset-mock',
  function (hooks) {
    setupRenderingTest(hooks);
    hooks.beforeEach(function () {
      this.mockHelperFunctions = mockScrollTo();
    });

    hooks.afterEach(function () {
      this.mockHelperFunctions.resetMock();
    });

    test('scrollTo returns correct default parameters', async function (assert) {
      await render(
        hbs`<div style="height: 10px" {{scroll-to-element-with-offset shouldScroll=true}} data-test-scroll-to-element-with-offset-selector></div>
        <div style="height: 10px" data-test-scroll-to-element-with-offset-not-modified></div>
        <div style="height: 10px" {{scroll-to-element-with-offset shouldScroll=false}} data-test-scroll-to-element-with-offset-not-scrolled></div>`
      );

      assert.ok(
        this.mockHelperFunctions.scrollToCalledWith(
          '[data-test-scroll-to-element-with-offset-selector]'
        ),
        'scrollToCalledWith should return true for the given element selector'
      );
      assert.ok(
        this.mockHelperFunctions.scrollToCalledWith(
          find('[data-test-scroll-to-element-with-offset-selector]')
        ),
        'scrollToCalledWith should return true for the given element'
      );
      assert.notOk(
        this.mockHelperFunctions.scrollToCalledWith(
          '[data-test-scroll-to-element-with-offset-not-modified]'
        ),
        "scrollToCalledWith should return false if the element doesn't have the modifier"
      );
      assert.notOk(
        this.mockHelperFunctions.scrollToCalledWith(
          '[data-test-scroll-to-element-with-offset-not-scrolled]'
        ),
        'scrollToCalledWith should return false if the modifier was not triggered'
      );
    });

    test('scrollTo returns correct options params', async function (assert) {
      this.options = {
        offset: 10,
        behavior: 'auto',
        left: 10,
      };

      await render(
        hbs`<div style="height: 10px" {{scroll-to-element-with-offset shouldScroll=true options=this.options}} data-test-scroll-to-element-with-offset-selector></div>`
      );

      assert.ok(
        this.mockHelperFunctions.scrollToCalledWith(
          '[data-test-scroll-to-element-with-offset-selector]',
          this.options
        ),
        'scrollToCalledWith should return true for the given element selector'
      );
      assert.ok(
        this.mockHelperFunctions.scrollToCalledWith(
          find('[data-test-scroll-to-element-with-offset-selector]'),
          this.options
        ),
        'scrollToCalledWith should return true for the given element'
      );
    });
  }
);
