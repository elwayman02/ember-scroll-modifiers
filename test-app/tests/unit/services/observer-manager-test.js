import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Service | observer-manager', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.observerManager = this.owner.lookup(
      'service:ember-scroll-modifiers@observer-manager',
    );

    sinon.stub(this.observerManager._admin, 'observe');
    sinon.stub(this.observerManager._admin, 'unobserve');
    sinon.stub(this.observerManager._admin, 'addEnterCallback');
    sinon.stub(this.observerManager._admin, 'addExitCallback');

    this.options = {
      root: undefined,
    };

    this.callback = () => {};
  });

  test('Creation', function (assert) {
    assert.ok(
      this.observerManager._admin,
      'intersection-observer-admin is created',
    );
  });

  test('observe', function (assert) {
    this.observerManager.observe('foo', this.options);
    assert.ok(
      this.observerManager._admin.observe.calledWith('foo', this.options),
      'observe is called with correct parameters',
    );
  });

  test('unobserve', function (assert) {
    this.observerManager.unobserve('foo', this.options);
    assert.ok(
      this.observerManager._admin.unobserve.calledWith('foo', this.options),
      'unobserve is called with correct parameters',
    );
  });

  test('addEnterCallback', function (assert) {
    this.observerManager.addEnterCallback('foo', this.callback);
    assert.ok(
      this.observerManager._admin.addEnterCallback.calledWith(
        'foo',
        this.callback,
      ),
      'addEnterCallback is called with correct parameters',
    );
  });

  test('addExitCallback', function (assert) {
    this.observerManager.addExitCallback('foo', this.callback);
    assert.ok(
      this.observerManager._admin.addExitCallback.calledWith(
        'foo',
        this.callback,
      ),
      'addExitCallback is called with correct parameters',
    );
  });
});
