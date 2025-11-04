import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Service | scroll-modifiers-observer', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.scrollModifiersObserver = this.owner.lookup(
      'service:scroll-modifiers-observer',
    );

    sinon.stub(this.scrollModifiersObserver._admin, 'observe');
    sinon.stub(this.scrollModifiersObserver._admin, 'unobserve');
    sinon.stub(this.scrollModifiersObserver._admin, 'addEnterCallback');
    sinon.stub(this.scrollModifiersObserver._admin, 'addExitCallback');

    this.options = {
      root: undefined,
    };

    this.callback = () => {};
  });

  test('Creation', function (assert) {
    assert.ok(
      this.scrollModifiersObserver._admin,
      'intersection-observer-admin is created',
    );
  });

  test('observe', function (assert) {
    this.scrollModifiersObserver.observe('foo', this.options);
    assert.ok(
      this.scrollModifiersObserver._admin.observe.calledWith(
        'foo',
        this.options,
      ),
      'observe is called with correct parameters',
    );
  });

  test('unobserve', function (assert) {
    this.scrollModifiersObserver.unobserve('foo', this.options);
    assert.ok(
      this.scrollModifiersObserver._admin.unobserve.calledWith(
        'foo',
        this.options,
      ),
      'unobserve is called with correct parameters',
    );
  });

  test('addEnterCallback', function (assert) {
    this.scrollModifiersObserver.addEnterCallback('foo', this.callback);
    assert.ok(
      this.scrollModifiersObserver._admin.addEnterCallback.calledWith(
        'foo',
        this.callback,
      ),
      'addEnterCallback is called with correct parameters',
    );
  });

  test('addExitCallback', function (assert) {
    this.scrollModifiersObserver.addExitCallback('foo', this.callback);
    assert.ok(
      this.scrollModifiersObserver._admin.addExitCallback.calledWith(
        'foo',
        this.callback,
      ),
      'addExitCallback is called with correct parameters',
    );
  });
});
