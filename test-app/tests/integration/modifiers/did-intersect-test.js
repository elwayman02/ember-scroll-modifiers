import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, setupOnerror } from '@ember/test-helpers';
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

      observe = sinon.stub().callsFake(() => {
        this.isObserving = true;
      });
      unobserve = sinon.stub().callsFake(() => {
        this.isObserving = false;
      });
      addEnterCallback = sinon.stub().callsFake((element, callback) => {
        this.onEnterCallback = sinon.spy(() => {
          if (this.isObserving) callback();
        });
      });
      addExitCallback = sinon.stub().callsFake((element, callback) => {
        this.onExitCallback = sinon.spy(() => {
          if (this.isObserving) callback();
        });
      });
    }

    this.owner.register(
      'service:ember-scroll-modifiers@observer-manager',
      MockObserverManager,
    );

    this.observerManagerMock = this.owner.lookup(
      'service:ember-scroll-modifiers@observer-manager',
    );
    this.enterStub = sinon.stub();
    this.exitStub = sinon.stub();
    this.maxEnter = 1;
    this.maxExit = 1;
  });

  test('modifier integrates with observer-manager and triggers correct callbacks when onEnter and onExit are provided', async function (assert) {
    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`,
    );

    assert.ok(
      this.observerManagerMock.observe.calledOnce,
      'observerManager received observe call',
    );
    assert.ok(
      this.observerManagerMock.addEnterCallback.calledOnce,
      'observerManager received enter callback',
    );
    assert.ok(
      this.observerManagerMock.addExitCallback.calledOnce,
      'observerManager received exit callback',
    );
  });

  test('modifier triggers addEnterCallback but not addExitCallback if only onEnter is provided', async function (assert) {
    await render(hbs`<div {{did-intersect onEnter=this.enterStub}}></div>`);

    assert.ok(
      this.observerManagerMock.addEnterCallback.calledOnce,
      'observerManager received enter callback',
    );
    assert.notOk(
      this.observerManagerMock.addExitCallback.calledOnce,
      'observerManager did not receive exit callback',
    );
  });

  test('modifier triggers addExitCallback but not addEnterCallback if only onExit is provided', async function (assert) {
    await render(hbs`<div {{did-intersect onExit=this.exitStub}}></div>`);

    assert.notOk(
      this.observerManagerMock.addEnterCallback.calledOnce,
      'observerManager did not receive enter callback',
    );
    assert.ok(
      this.observerManagerMock.addExitCallback.calledOnce,
      'observerManager received exit callback',
    );
  });

  test('modifier throws assertion if neither onEnter or onExit is provided', async function (assert) {
    setupOnerror((error) => {
      assert.strictEqual(
        error.message,
        'Assertion Failed: onEnter or/and onExit is required',
      );
    });
    await render(hbs`<div {{did-intersect}}></div>`);

    assert.notOk(
      this.observerManagerMock.addEnterCallback.calledOnce,
      'observerManager did not receive enter callback',
    );
    assert.notOk(
      this.observerManagerMock.addExitCallback.calledOnce,
      'observerManager did not receive callback',
    );
  });

  test('modifier uses default observer options when none is provided', async function (assert) {
    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`,
    );

    const options = this.observerManagerMock.observe.args[0][1];
    assert.deepEqual(
      options,
      DEFAULT_OBSERVER_OPTIONS,
      'options uses correct default options',
    );
  });

  test('modifier passes custom options to IntersectionObserver', async function (assert) {
    this.threshold = [0];
    this.options = { threshold: this.threshold };

    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub options=this.options}}></div>`,
    );

    assert.strictEqual(
      this.observerManagerMock.observe.args[0][1].threshold[0],
      0,
      'options received correct parameters',
    );
  });

  test('modifier graceful no-op if IntersectionObserver does not exist', async function (assert) {
    const intersectionObserver = window.IntersectionObserver;

    delete window.IntersectionObserver;

    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`,
    );

    assert.notOk(
      this.observerManagerMock.observe.calledOnce,
      'observerManager did not received observe call',
    );
    assert.notOk(
      this.observerManagerMock.addEnterCallback.calledOnce,
      'observerManager did not receive enter callback',
    );
    assert.notOk(
      this.observerManagerMock.addExitCallback.calledOnce,
      'observerManager did not receive enter callback',
    );

    window.IntersectionObserver = intersectionObserver;
  });

  test('modifier onEnter callback never exceeds maxEnter if maxEnter is provided', async function (assert) {
    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub maxEnter=this.maxEnter}}></div>`,
    );
    for (let i = 0; i < this.maxEnter + 1; i++) {
      this.observerManagerMock.onEnterCallback();
    }

    assert.strictEqual(
      this.enterStub.callCount,
      this.maxEnter,
      'Enter callback is only called given maxEnter number of times',
    );
  });

  test('modifier onExit callback never exceeds maxExit if maxExit is provided', async function (assert) {
    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub maxExit=this.maxExit}}></div>`,
    );

    for (let i = 0; i < this.maxExit + 1; i++) {
      this.observerManagerMock.onExitCallback();
    }

    assert.strictEqual(
      this.exitStub.callCount,
      this.maxExit,
      'Exit callback is only called given maxEnter number of times',
    );
  });

  test('modifier unobserves element when maxEnter and maxExit are both exceeded', async function (assert) {
    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub maxEnter=this.maxEnter maxExit=this.maxExit}}></div>`,
    );

    for (let i = 0; i < this.maxEnter + 1; i++) {
      this.observerManagerMock.onEnterCallback();
    }

    for (let i = 0; i < this.maxExit + 1; i++) {
      this.observerManagerMock.onExitCallback();
    }

    assert.strictEqual(this.observerManagerMock.unobserve.callCount, 1);
  });

  test('modifier unobserves element when maxEnter is exceeded and no onExit is provided', async function (assert) {
    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub maxEnter=this.maxEnter}}></div>`,
    );

    for (let i = 0; i < this.maxEnter + 1; i++) {
      this.observerManagerMock.onEnterCallback();
    }

    assert.strictEqual(this.observerManagerMock.unobserve.callCount, 1);
  });

  test('modifier unobserves element when maxExit is exceeded and no onEnter is provided', async function (assert) {
    await render(
      hbs`<div {{did-intersect onExit=this.exitStub maxExit=this.maxExit}}></div>`,
    );

    for (let i = 0; i < this.maxExit + 1; i++) {
      this.observerManagerMock.onExitCallback();
    }

    assert.strictEqual(this.observerManagerMock.unobserve.callCount, 1);
  });

  test('modifier onEnter and onExit callback can fire without limit if maxEnter and maxExit is not provided', async function (assert) {
    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`,
    );

    const numOfFiredCallback = this.maxEnter + this.maxExit;

    for (let i = 0; i < numOfFiredCallback; i++) {
      this.observerManagerMock.onEnterCallback();
      this.observerManagerMock.onExitCallback();
    }

    assert.strictEqual(
      this.observerManagerMock.unobserve.callCount,
      0,
      'unobserve has never been triggered',
    );

    assert.strictEqual(
      this.enterStub.callCount,
      numOfFiredCallback,
      'Enter callback has fired more than maxEnter times',
    );
    assert.strictEqual(
      this.exitStub.callCount,
      numOfFiredCallback,
      'Exit callback has fired more than maxExit times',
    );
  });

  test('modifier trigger addEnterCallback and addExitCallback only once when arguments change', async function (assert) {
    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub maxEnter=this.maxEnter maxExit=this.maxExit}}></div>`,
    );

    this.set('enterStub', sinon.stub());
    this.set('exitStub', sinon.stub());

    // Wait for re-render to complete
    await settled();

    assert.strictEqual(this.observerManagerMock.addEnterCallback.callCount, 1);
    assert.strictEqual(this.observerManagerMock.addExitCallback.callCount, 1);
  });

  test('modifier triggers correct addEnterCallback and addExitCallback when callbacks change', async function (assert) {
    this.newEnterStub = sinon.stub();
    this.newExitStub = sinon.stub();

    await render(
      hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`,
    );

    this.observerManagerMock.onEnterCallback();
    this.observerManagerMock.onExitCallback();

    assert.strictEqual(
      this.enterStub.callCount,
      1,
      'initial enter callback is called',
    );
    assert.strictEqual(
      this.exitStub.callCount,
      1,
      'initial exit callback is called',
    );

    this.oldEnterStub = this.enterStub;
    this.oldExitStub = this.exitStub;

    this.set('enterStub', this.newEnterStub);
    this.set('exitStub', this.newExitStub);

    // Wait for re-render to complete
    await settled();

    this.observerManagerMock.onEnterCallback();
    this.observerManagerMock.onExitCallback();

    assert.strictEqual(
      this.oldEnterStub.callCount,
      1,
      'no more old enter callback is being made',
    );
    assert.strictEqual(
      this.oldExitStub.callCount,
      1,
      'no more old exit callback is being made',
    );

    assert.strictEqual(
      this.newEnterStub.callCount,
      1,
      'new enter callback is called',
    );

    assert.strictEqual(
      this.newExitStub.callCount,
      1,
      'new exit callback is called',
    );
  });

  module('modifier accepts `isObserving` argument', function () {
    test('with a truth(y) value', async function (assert) {
      await render(hbs`
        <div
          {{did-intersect
            isObserving=true
            onEnter=this.enterStub
            onExit=this.exitStub
          }}
        ></div>
      `);

      this.observerManagerMock.onEnterCallback();
      this.observerManagerMock.onExitCallback();

      assert.ok(this.enterStub.calledOnce, 'the enter callback is invoked');
      assert.ok(this.exitStub.calledOnce, 'the onExit callback is invoked');
    });

    test('with a false(y) value', async function (assert) {
      await render(hbs`
        <div
          {{did-intersect
            isObserving=false
            onEnter=this.enterStub
            onExit=this.exitStub
          }}
        ></div>
      `);

      this.observerManagerMock.onEnterCallback();
      this.observerManagerMock.onExitCallback();

      assert.ok(this.enterStub.notCalled, 'the enter callback is not invoked');
      assert.ok(this.exitStub.notCalled, 'the onExit callback is not invoked');
    });
  });
});
