import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, clearRender } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module('Integration | Modifier | scroll-into-view', function (hooks) {
  setupRenderingTest(hooks);
  const sandbox = sinon.createSandbox();

  hooks.beforeEach(function () {
    this.scrollIntoViewSpy = sandbox.spy(Element.prototype, 'scrollIntoView');
  });

  hooks.afterEach(function () {
    this.scrollIntoViewSpy = null;
    sandbox.restore();
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
});
