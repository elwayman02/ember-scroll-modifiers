import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module(
  'Integration | Modifier | scroll-to-element-with-offset',
  function (hooks) {
    setupRenderingTest(hooks);
    const sandbox = sinon.createSandbox();

    hooks.beforeEach(function () {
      this.scrollToSpy = sandbox.spy(window, 'scrollTo');
      this.getBoundingClientRectStub = sandbox.stub(
        Element.prototype,
        'getBoundingClientRect'
      );
      this.getBoundingClientRectStub.onCall(0).returns({ top: 100 });
      this.getBoundingClientRectStub.onCall(1).returns({ top: 25 });
    });

    hooks.afterEach(function () {
      this.scrollToSpy = null;
      sandbox.restore();
    });

    test('it renders and calls scrollTo when shouldScroll is true', async function (assert) {
      await render(
        hbs`<div {{scroll-to-element-with-offset shouldScroll=true}}></div>`
      );

      assert.ok(this.scrollToSpy.called, 'scrollTo was called');
    });

    test('it renders and passes default options to scrollTo', async function (assert) {
      await render(
        hbs`<div {{scroll-to-element-with-offset shouldScroll=true}}></div>`
      );

      assert.deepEqual(
        this.scrollToSpy.args[0][0].behavior,
        'smooth',
        'scrollTo was called with correct params'
      );

      assert.deepEqual(
        this.scrollToSpy.args[0][0].left,
        0,
        'scrollTo was called with correct params'
      );
    });

    test('it renders and calculates correct default top offset for scrollTo', async function (assert) {
      await render(
        hbs`<div id="test" {{scroll-to-element-with-offset shouldScroll=true}}></div>`
      );

      assert.deepEqual(
        this.scrollToSpy.args[0][0],
        {
          behavior: 'smooth',
          left: 0,
          top: 75,
        },
        'scrollTo was called with correct params'
      );
    });

    test('it renders and calculates correct top offset for scrollTo when offset is passed in', async function (assert) {
      this.options = {
        offset: 50,
      };

      await render(
        hbs`<div id="test" {{scroll-to-element-with-offset shouldScroll=true options=this.options}}></div>`
      );

      assert.deepEqual(
        this.scrollToSpy.args[0][0],
        {
          behavior: 'smooth',
          left: 0,
          top: 25,
        },
        'scrollTo was called with correct params'
      );
    });

    test('it does not call scrollTo when shouldScroll is false', async function (assert) {
      await render(
        hbs`<div {{scroll-to-element-with-offset shouldScroll=false}}></div>`
      );

      assert.notOk(this.scrollToSpy.called, 'scrollTo was not called');
    });

    test('it renders when shouldScroll resolves to true', async function (assert) {
      this.options = { test: true };
      let resolvePromise;
      this.shouldScroll = new Promise((resolve) => (resolvePromise = resolve));

      await render(
        hbs`<div {{scroll-to-element-with-offset shouldScroll=this.shouldScroll}}></div>`
      );

      assert.ok(this.scrollToSpy.notCalled, 'scrollTo was not called');

      await resolvePromise(true);

      assert.ok(this.scrollToSpy.called, 'scrollTo was called');
    });

    test('it does not render when shouldScroll resolves to false', async function (assert) {
      this.options = { test: true };
      let resolvePromise;
      this.shouldScroll = new Promise((resolve) => (resolvePromise = resolve));

      await render(
        hbs`<div {{scroll-to-element-with-offset shouldScroll=this.shouldScroll}}></div>`
      );

      await resolvePromise(false);

      assert.ok(this.scrollToSpy.notCalled, 'scrollTo was not called');
    });
  }
);
