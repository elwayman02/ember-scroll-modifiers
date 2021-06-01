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
      hbs`<div {{scroll-into-view options=this.options shouldScroll=true}}></div>`
    );

    assert.ok(this.scrollIntoViewSpy.called, 'scrollIntoView was called');

    assert.deepEqual(
      this.scrollIntoViewSpy.args[0][0],
      this.options,
      'scrollIntoView was called with correct params'
    );
  });

  test('it does not render when shouldScroll is false', async function (assert) {
    this.options = { test: true };

    await render(
      hbs`<div {{scroll-into-view options=this.options shouldScroll=false}}></div>`
    );

    assert.notOk(this.scrollIntoViewSpy.called, 'scrollIntoView was not');
  });

  test('it renders when shouldScroll resolves to true', async function (assert) {
    this.options = { test: true };
    let resolvePromise;
    this.shouldScroll = new Promise((resolve) => (resolvePromise = resolve));

    await render(
      hbs`<div {{scroll-into-view options=this.options shouldScroll=this.shouldScroll}}></div>`
    );

    assert.ok(
      this.scrollIntoViewSpy.notCalled,
      'scrollIntoView was not called'
    );

    await resolvePromise(true);

    assert.ok(this.scrollIntoViewSpy.called, 'scrollIntoView was called');
  });

  test('it does not render when shouldScroll resolves to false', async function (assert) {
    this.options = { test: true };
    let resolvePromise;
    this.shouldScroll = new Promise((resolve) => (resolvePromise = resolve));

    await render(
      hbs`<div {{scroll-into-view options=this.options shouldScroll=this.shouldScroll}}></div>`
    );

    await resolvePromise(false);

    assert.notOk(
      this.scrollIntoViewSpy.called,
      'scrollIntoView was not called'
    );
  });

  test('it does not call scrollIntoView if destroyed before shouldScroll is resolved', async function (assert) {
    this.options = { test: true };
    let resolvePromise;
    this.shouldScroll = new Promise((resolve) => (resolvePromise = resolve));

    await render(
      hbs`<div {{scroll-into-view options=this.options shouldScroll=this.shouldScroll}}></div>`
    );

    await clearRender();

    await resolvePromise(true);

    assert.notOk(
      this.scrollIntoViewSpy.called,
      'scrollIntoView was not called'
    );
  });
});
