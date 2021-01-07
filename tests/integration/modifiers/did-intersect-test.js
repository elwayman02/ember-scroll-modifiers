import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, setupOnerror } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import Service from '@ember/service';
import { DEFAULT_OBSERVER_OPTIONS } from 'ember-scroll-modifiers/modifiers/did-intersect';

module('Integration | Modifier | did-intersect', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    class MockObserverManager extends Service {
      constructor() {
        super(...arguments);
        this._admin = {};
      }

      observe = sinon.stub();
      unobserve = sinon.stub();
      addEnterCallback = sinon.stub();
      addExitCallback = sinon.stub();
    }

    this.owner.register(
      'service:ember-scroll-modifiers@observer-manager',
      MockObserverManager
    );

    this.observerManagerMock = this.owner.lookup(
      'service:ember-scroll-modifiers@observer-manager'
    );
    this.enterStub = sinon.stub();
    this.exitStub = sinon.stub();
  });

  test('modifier integrates with observer-manager and triggers correct callbacks when onEnter and onExit are provided', async function (assert) {
    assert.expect(3);

    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`
    );

    assert.ok(
      this.observerManagerMock.observe.calledOnce,
      'observerManager received observe call'
    );
    assert.ok(
      this.observerManagerMock.addEnterCallback.calledOnce,
      'observerManager received enter callback'
    );
    assert.ok(
      this.observerManagerMock.addExitCallback.calledOnce,
      'observerManager received exit callback'
    );
  });

  test('modifier triggers addEnterCallback but not addExitCallback if only onEnter is provided', async function (assert) {
    await render(hbs`<div {{did-intersect onEnter=this.enterStub}}></div>`);

    assert.ok(
      this.observerManagerMock.addEnterCallback.calledOnce,
      'observerManager received enter callback'
    );
    assert.notOk(
      this.observerManagerMock.addExitCallback.calledOnce,
      'observerManager did not receive exit callback'
    );
  });

  test('modifier triggers addExitCallback but not addEnterCallback if only onExit is provided', async function (assert) {
    await render(hbs`<div {{did-intersect onExit=this.exitStub}}></div>`);

    assert.notOk(
      this.observerManagerMock.addEnterCallback.calledOnce,
      'observerManager did not receive enter callback'
    );
    assert.ok(
      this.observerManagerMock.addExitCallback.calledOnce,
      'observerManager received exit callback'
    );
  });

  test('modifier throws assertion if neither onEnter or onExit is provided', async function (assert) {
    assert.expect(3);

    setupOnerror((error) => {
      assert.equal(
        error.message,
        'Assertion Failed: onEnter or/and onExit is required'
      );
    });
    await render(hbs`<div {{did-intersect}}></div>`);

    assert.notOk(
      this.observerManagerMock.addEnterCallback.calledOnce,
      'observerManager did not receive enter callback'
    );
    assert.notOk(
      this.observerManagerMock.addExitCallback.calledOnce,
      'observerManager did not receive callback'
    );
  });

  test('modifier uses default observer options when none is provided', async function (assert) {
    assert.expect(1);

    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`
    );

    const options = this.observerManagerMock.observe.args[0][1];
    assert.deepEqual(
      options,
      DEFAULT_OBSERVER_OPTIONS,
      'options uses correct default options'
    );
  });

  test('modifier passes custom options to IntersectionObserver', async function (assert) {
    this.threshold = [0];
    this.options = { threshold: this.threshold };

    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub options=this.options}}></div>`
    );

    assert.equal(
      this.observerManagerMock.observe.args[0][1].threshold[0],
      0,
      'options received correct parameters'
    );
  });

  test('modifier graceful no-op if IntersectionObserver does not exist', async function (assert) {
    const intersectionObserver = window.IntersectionObserver;

    delete window.IntersectionObserver;

    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`
    );

    assert.notOk(
      this.observerManagerMock.observe.calledOnce,
      'observerManager did not received observe call'
    );
    assert.notOk(
      this.observerManagerMock.addEnterCallback.calledOnce,
      'observerManager did not receive enter callback'
    );
    assert.notOk(
      this.observerManagerMock.addExitCallback.calledOnce,
      'observerManager did not receive enter callback'
    );

    window.IntersectionObserver = intersectionObserver;
  });
});
