import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

let intersectionCallback;
let intersectionOptions;
let observeStub;
let disconnectStub;
let MockIntersectionObserver;

module('Integration | Modifier | did-intersect', function (hooks) {
  setupRenderingTest(hooks);

  let intersectionObserver;

  hooks.beforeEach(function () {
    intersectionCallback = null;
    intersectionOptions = null;
    observeStub = sinon.stub();
    disconnectStub = sinon.stub();

    MockIntersectionObserver = class MockIntersectionObserver {
      constructor(callback, options) {
        intersectionCallback = callback;
        intersectionOptions = options;
      }

      observe = observeStub;
      disconnect = disconnectStub;
    }

    intersectionObserver = window.IntersectionObserver;
    window.IntersectionObserver = MockIntersectionObserver;

    this.intersectStub = sinon.stub();
  });

  hooks.afterEach(function () {
    window.IntersectionObserver = intersectionObserver;
  });

  test('modifier integrates with IntersectionObserver', async function (assert) {
    await render(hbs`<div {{did-intersect this.intersectStub}}></div>`);

    assert.ok(intersectionCallback, 'IntersectionObserver received callback');
    assert.ok(observeStub.calledOnce, 'observe was called');
    assert.ok(intersectionOptions, 'options passed to IntersectionObserver');
    assert.ok(intersectionOptions.threshold, 'threshold included in default options');
    assert.equal(intersectionOptions.threshold[0], 1, 'default threshold is 1');

    let [element] = observeStub.args[0];

    assert.ok(element, 'element was passed to observe');
  });

  test('modifier triggers handler when IntersectionObserver fires callback', async function (assert) {
    await render(hbs`<div {{did-intersect this.intersectStub}}></div>`);

    let fakeEntry = { target: {} };
    let fakeObserver = { observe: {} };

    intersectionCallback([fakeEntry], fakeObserver);

    assert.ok(this.intersectStub.calledOnceWith(fakeEntry, fakeObserver), 'handler fired with correct parameters');
  });

  test('modifier passes custom threshold to IntersectionObserver', async function (assert) {
    this.threshold = [0];

    await render(hbs`<div {{did-intersect this.intersectStub this.threshold}}></div>`);

    assert.ok(intersectionOptions, 'options passed to IntersectionObserver');
    assert.equal(intersectionOptions.threshold, this.threshold, 'custom threshold included in options');
  });

  test('modifier graceful no-op if IntersectionObserver does not exist', async function (assert) {
    delete window.IntersectionObserver;

    await render(hbs`<div {{did-intersect this.intersectStub}}></div>`);

    assert.notOk(intersectionCallback, 'no callback received');
    assert.notOk(observeStub.calledOnce, 'observe was not called');
  });
});
