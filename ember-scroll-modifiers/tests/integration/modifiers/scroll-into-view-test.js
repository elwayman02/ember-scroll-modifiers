import { clearRender, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import sinon from 'sinon';

module('Integration | Modifier | scroll-into-view', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    window.matchMedia = sinon.stub().returns({ matches: false });
    this.scrollIntoViewSpy = sinon.spy(Element.prototype, 'scrollIntoView');
  });

  hooks.afterEach(function () {
    this.scrollIntoViewSpy = null;
  });

  test('it renders and passes options when shouldScroll is true', async function (assert) {
    this.options = { test: true };

    await render(
      hbs`<div {{scroll-into-view options=this.options shouldScroll=true}}></div>`,
    );

    assert.ok(this.scrollIntoViewSpy.called, 'scrollIntoView was called');

    assert.deepEqual(
      this.scrollIntoViewSpy.args[0][0],
      this.options,
      'scrollIntoView was called with correct params',
    );
  });

  test('it does not render when shouldScroll is false', async function (assert) {
    this.options = { test: true };

    await render(
      hbs`<div {{scroll-into-view options=this.options shouldScroll=false}}></div>`,
    );

    assert.notOk(this.scrollIntoViewSpy.called, 'scrollIntoView was not');
  });

  test('it renders when shouldScroll resolves to true', async function (assert) {
    this.options = { test: true };
    let resolvePromise;
    this.shouldScroll = new Promise((resolve) => (resolvePromise = resolve));

    await render(
      hbs`<div {{scroll-into-view options=this.options shouldScroll=this.shouldScroll}}></div>`,
    );

    assert.ok(
      this.scrollIntoViewSpy.notCalled,
      'scrollIntoView was not called',
    );

    await resolvePromise(true);

    assert.ok(this.scrollIntoViewSpy.called, 'scrollIntoView was called');
  });

  test('it does not render when shouldScroll resolves to false', async function (assert) {
    this.options = { test: true };
    let resolvePromise;
    this.shouldScroll = new Promise((resolve) => (resolvePromise = resolve));

    await render(
      hbs`<div {{scroll-into-view options=this.options shouldScroll=this.shouldScroll}}></div>`,
    );

    await resolvePromise(false);

    assert.notOk(
      this.scrollIntoViewSpy.called,
      'scrollIntoView was not called',
    );
  });

  test('it does not call scrollIntoView if destroyed before shouldScroll is resolved', async function (assert) {
    this.options = { test: true };
    let resolvePromise;
    this.shouldScroll = new Promise((resolve) => (resolvePromise = resolve));

    await render(
      hbs`<div {{scroll-into-view options=this.options shouldScroll=this.shouldScroll}}></div>`,
    );

    await clearRender();

    await resolvePromise(true);

    assert.notOk(
      this.scrollIntoViewSpy.called,
      'scrollIntoView was not called',
    );
  });

  module('with offsets', function (offsetHooks) {
    offsetHooks.beforeEach(function () {
      this.scrollToSpy = sinon.spy(window, 'scrollTo');
      this.getBoundingClientRectStub = sinon.stub(
        Element.prototype,
        'getBoundingClientRect',
      );

      this.getBoundingClientRectStub.returns({ left: 100, top: 100 });
    });

    test('it renders and passes default `behavior` to scrollTo', async function (assert) {
      this.options = {
        topOffset: 50,
      };

      await render(
        hbs`<div {{scroll-into-view shouldScroll=true options=this.options}}></div>`,
      );

      assert.strictEqual(
        this.scrollToSpy.args[0][0].behavior,
        'auto',
        'scrollTo was called with correct params',
      );
    });

    test('it renders and passes behavior to scrollTo', async function (assert) {
      this.options = {
        behavior: 'smooth',
        topOffset: 50,
      };

      await render(
        hbs`<div {{scroll-into-view shouldScroll=true options=this.options}}></div>`,
      );

      assert.strictEqual(
        this.scrollToSpy.args[0][0].behavior,
        'smooth',
        'scrollTo was called with correct params',
      );
    });

    test('it renders and calculates correct top offset for scrollTo when offset is passed in', async function (assert) {
      this.options = {
        topOffset: 50,
        leftOffset: 40,
      };

      this.getBoundingClientRectStub.onCall(0).returns({ left: 100 });
      this.getBoundingClientRectStub.onCall(1).returns({ left: 25 });

      this.getBoundingClientRectStub.onCall(2).returns({ top: 100 });
      this.getBoundingClientRectStub.onCall(3).returns({ top: 25 });

      await render(
        hbs`<div id="test" {{scroll-into-view shouldScroll=true options=this.options}}></div>`,
      );

      assert.deepEqual(
        this.scrollToSpy.args[0][0],
        {
          behavior: 'auto',
          left: 35,
          top: 25,
        },
        'scrollTo was called with correct params',
      );
    });

    test('it does not call scrollTo when shouldScroll is false', async function (assert) {
      this.options = {
        topOffset: 50,
        leftOffset: 40,
      };

      await render(
        hbs`<div {{scroll-into-view shouldScroll=false options=this.options}}></div>`,
      );

      assert.notOk(this.scrollToSpy.called, 'scrollTo was not called');
    });

    test('it renders when shouldScroll resolves to true', async function (assert) {
      this.options = {
        topOffset: 50,
        leftOffset: 40,
      };

      let resolvePromise;
      this.shouldScroll = new Promise((resolve) => (resolvePromise = resolve));

      await render(
        hbs`<div {{scroll-into-view shouldScroll=this.shouldScroll options=this.options}}></div>`,
      );

      assert.ok(this.scrollToSpy.notCalled, 'scrollTo was not called');

      await resolvePromise(true);

      assert.ok(this.scrollToSpy.called, 'scrollTo was called');
    });

    test('it does not render when shouldScroll resolves to false', async function (assert) {
      this.options = {
        topOffset: 50,
        leftOffset: 40,
      };

      let resolvePromise;
      this.shouldScroll = new Promise((resolve) => (resolvePromise = resolve));

      await render(
        hbs`<div {{scroll-into-view shouldScroll=this.shouldScroll options=this.options}}></div>`,
      );

      await resolvePromise(false);

      assert.ok(this.scrollToSpy.notCalled, 'scrollTo was not called');
    });
  });

  module('with offsets and custom scroll container', function (offsetHooks) {
    offsetHooks.beforeEach(function () {
      this.scrollToSpy = sinon.spy(Element.prototype, 'scrollTo');
    });

    test('it renders and passes default `behavior` to scrollTo', async function (assert) {
      this.options = {
        topOffset: 50,
        scrollContainerId: 'custom-scroll-container',
      };

      await render(
        hbs`
        <div id="custom-scroll-container">
          <div {{scroll-into-view shouldScroll=true options=this.options}}/>
        </div>`,
      );

      assert.strictEqual(
        this.scrollToSpy.thisValues[0].id,
        'custom-scroll-container',
        'scrollTo was called on the custom scroll container',
      );
      assert.strictEqual(
        this.scrollToSpy.args[0][0].behavior,
        'auto',
        'scrollTo was called with correct params',
      );
    });

    test('it renders and calculates correct offsets for scrollTo', async function (assert) {
      this.options = {
        topOffset: 50,
        leftOffset: 40,
        scrollContainerId: 'custom-scroll-container',
      };
      const offsetContainer = {
        offsetTop: 200,
        offsetLeft: 100,
      };
      const offsetElement = {
        offsetTop: 300,
        offsetLeft: 200,
      };
      let offsetTopCall = -1;
      let offsetLeftCall = -1;

      this.offsetTopStub = sinon
        .stub(HTMLElement.prototype, 'offsetTop')
        .get(() => {
          offsetTopCall += 1;
          return offsetTopCall === 0
            ? offsetElement.offsetTop
            : offsetContainer.offsetTop;
        });
      this.offsetLeftStub = sinon
        .stub(HTMLElement.prototype, 'offsetLeft')
        .get(() => {
          offsetLeftCall += 1;
          return offsetLeftCall === 0
            ? offsetElement.offsetLeft
            : offsetContainer.offsetLeft;
        });

      await render(
        hbs`
        <div id="custom-scroll-container">
          <div {{scroll-into-view shouldScroll=true options=this.options}}/>
        </div>`,
      );

      assert.deepEqual(
        this.scrollToSpy.args[0][0],
        {
          behavior: 'auto',
          left: 60,
          top: 50,
        },
        'scrollTo was called with correct params',
      );
    });
  });

  module('with focus', function () {
    test('it scrolls and focuses on first focusable element', async function (assert) {
      await render(
        hbs`<div {{scroll-into-view shouldScroll=true shouldFocusAfterScroll=true}}>
          <button data-test-focus-selector />
        </div>`,
      );

      assert.true(this.scrollIntoViewSpy.called, 'scrollIntoView was called');
      assert
        .dom('[data-test-focus-selector]')
        .isFocused('First focusable element has focus');
    });

    test('it does not focus when shouldFocusAfterScroll is false', async function (assert) {
      await render(
        hbs`<div {{scroll-into-view shouldScroll=true shouldFocusAfterScroll=false}}>
          <button data-test-focus-selector />
        </div>`,
      );

      assert
        .dom('[data-test-focus-selector]')
        .isNotFocused('Focusable element does not have focus');
    });

    test('it does not focus when focusable element is not found', async function (assert) {
      await render(
        hbs`<div {{scroll-into-view shouldScroll=true shouldFocusAfterScroll=true}}>
          <div data-test-non-focus-selector />
        </div>`,
      );

      assert
        .dom('[data-test-non-focus-selector]')
        .isNotFocused('Non-focusable element does not have focus');
    });

    test('it focuses on given focusable element', async function (assert) {
      await render(
        hbs`<div {{scroll-into-view shouldScroll=true shouldFocusAfterScroll=true focusSelector='[data-test-focus-selector]'}}>
          <button />
          <button data-test-focus-selector />
        </div>`,
      );

      assert
        .dom('[data-test-focus-selector]')
        .isFocused('Given focusable element has focus');
    });

    test('it focuses on first focusable element when given focusable element is not found', async function (assert) {
      await render(
        hbs`<div {{scroll-into-view shouldScroll=true shouldFocusAfterScroll=true focusSelector='[data-test-bad-selector]'}}>
          <button data-test-focus-selector />
          <button />
        </div>`,
      );

      assert
        .dom('[data-test-focus-selector]')
        .isFocused('First focusable element has focus');
    });
  });

  module('prefers-reduced-motion', function (motionHooks) {
    motionHooks.beforeEach(function () {
      this.scrollToSpyMotion = sinon.spy(window, 'scrollTo');

      this.smoothOptions = { behavior: 'smooth' };
      this.instantOptions = { behavior: 'instant' };
    });

    test('it handles prefers-reduced-motion setting enabled', async function (assert) {
      window.matchMedia = sinon.stub().returns({ matches: true });

      await render(
        hbs`<div {{scroll-into-view options=this.smoothOptions shouldScroll=true}}></div>`,
      );

      assert.ok(this.scrollIntoViewSpy.called, 'scrollIntoView was called');

      assert.deepEqual(
        this.scrollIntoViewSpy.args[0][0],
        this.instantOptions,
        'scrollIntoView was called with correct params',
      );
    });

    test('it handles prefers-reduced-motion setting disabled and request behavior smooth', async function (assert) {
      window.matchMedia = sinon.stub().returns({ matches: false });

      await render(
        hbs`<div {{scroll-into-view options=this.smoothOptions shouldScroll=true}}></div>`,
      );

      assert.ok(this.scrollIntoViewSpy.called, 'scrollIntoView was called');

      assert.deepEqual(
        this.scrollIntoViewSpy.args[0][0],
        this.smoothOptions,
        'scrollIntoView was called with correct params',
      );
    });

    test('it handles prefers-reduced-motion setting disabled and request behavior instant', async function (assert) {
      window.matchMedia = sinon.stub().returns({ matches: false });

      await render(
        hbs`<div {{scroll-into-view options=this.instantOptions shouldScroll=true}}></div>`,
      );

      assert.ok(this.scrollIntoViewSpy.called, 'scrollIntoView was called');

      assert.deepEqual(
        this.scrollIntoViewSpy.args[0][0],
        this.instantOptions,
        'scrollIntoView was called with correct params',
      );
    });

    test('it does not set behavior when not passed as option', async function (assert) {
      window.matchMedia = sinon.stub().returns({ matches: true });
      this.options = { test: 'test' };

      await render(
        hbs`<div {{scroll-into-view options=this.options shouldScroll=true}}></div>`,
      );

      assert.ok(this.scrollIntoViewSpy.called, 'scrollIntoView was called');

      assert.deepEqual(
        this.scrollIntoViewSpy.args[0][0],
        this.options,
        'scrollIntoView was called with correct params',
      );
    });

    test('it does not override default behavior when not passed as option with offset', async function (assert) {
      window.matchMedia = sinon.stub().returns({ matches: true });
      this.options = { test: 'test', topOffset: 50 };

      await render(
        hbs`<div {{scroll-into-view options=this.options shouldScroll=true}}></div>`,
      );

      assert.strictEqual(
        this.scrollToSpyMotion.args[0][0].behavior,
        'auto',
        'scrollTo was called with correct behavior',
      );
    });

    test('it handles prefers-reduced-motion setting enabled with offset present', async function (assert) {
      window.matchMedia = sinon.stub().returns({ matches: true });
      this.options = {
        ...this.smoothOptions,
        topOffset: 50,
      };

      await render(
        hbs`<div {{scroll-into-view shouldScroll=true options=this.options}}></div>`,
      );

      assert.strictEqual(
        this.scrollToSpyMotion.args[0][0].behavior,
        this.instantOptions.behavior,
        'scrollTo was called with correct behavior',
      );
    });

    test('it handles prefers-reduced-motion setting disabled with offset present', async function (assert) {
      window.matchMedia = sinon.stub().returns({ matches: false });
      this.options = {
        ...this.smoothOptions,
        topOffset: 50,
      };

      await render(
        hbs`<div {{scroll-into-view shouldScroll=true options=this.options}}></div>`,
      );

      assert.strictEqual(
        this.scrollToSpyMotion.args[0][0].behavior,
        this.smoothOptions.behavior,
        'scrollTo was called with correct behavior',
      );
    });
  });
});
