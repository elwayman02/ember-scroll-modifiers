import { assert } from '@ember/debug';
import { settled } from '@ember/test-helpers';
import Modifier from 'ember-modifier';

/**
 * A mock class for did-intersect.
 * Allows consumer to test their integration by explicitly invoking the callbacks deterministically.
 * Provides 2 API:
 * 1. enter() - to force trigger enter callback.
 * 2. exit() - to force trigger exit callback.
 *
 * Uses `settled` to handle downstream side effects and to be consistent with other built-in test helpers.
 *
 * @example
 * Integration Test
 * ```js
 *  const didIntersectMock = setupDidIntersectModifier(this);
 *
 *  await render(...);
 *  ...
 *
 *  didIntersectMock.enter();
 *  ...
 *
 *  didIntersectMock.exit();
 * ```
 */
class DidIntersectMock {
  onEnter;

  onExit;

  _numOfEnters = 0;

  _numOfExits = 0;

  maxEnterIntersections;

  maxExitIntersections;

  get _isExceedingMaxEnters() {
    if (!Number.isInteger(this.maxEnterIntersections)) {
      return false;
    }

    return this._numOfEnters >= this.maxEnterIntersections;
  }

  get _isExceedingMaxExits() {
    if (!Number.isInteger(this.maxExitIntersections)) {
      return false;
    }

    return this._numOfExits >= this.maxExitIntersections;
  }

  async enter() {
    if (this._isExceedingMaxEnters) {
      return settled();
    }

    this.onEnter();
    this._numOfEnters++;

    return settled();
  }

  async exit() {
    if (this._isExceedingMaxExits) {
      return settled();
    }

    this.onExit();
    this._numOfExits++;

    return settled();
  }
}

/**
 * Allows consummer to replace the real did-intersect with a did-intersect mock for deterministic testing.
 * @param {Object} context the test context
 */
export function setupDidIntersectModifier(context) {
  const didIntersectMock = new DidIntersectMock();

  /**
   * A dummy modifier to pass argumments into DidIntersectMock
   */
  class DidIntersectModifierMock extends Modifier {
    didReceiveArguments() {
      // Ignoring `options` because irrelevant for testing
      let { onEnter, onExit, maxEnter, maxExit } = this.args.named;

      assert('onEnter or/and onExit is required', onEnter || onExit);

      if (onEnter) {
        assert('onEnter must be a function', typeof onEnter === 'function');
        didIntersectMock.onEnter = onEnter;
      }

      if (onExit) {
        assert('onExit must be a function', typeof onExit === 'function');
        didIntersectMock.onExit = onExit;
      }

      // We should technically accept 0, in case of programmatic changes
      if (maxEnter || maxEnter === 0) {
        assert('maxEnter must be an integer', Number.isInteger(maxEnter));
        didIntersectMock.maxEnterIntersections = maxEnter;
      }

      // We should accept 0 here too.
      if (maxExit || maxExit === 0) {
        assert('maxExit must be an integer', Number.isInteger(maxExit));
        didIntersectMock.maxExitIntersections = maxExit;
      }
    }
  }

  context.owner.register('modifier:did-intersect', DidIntersectModifierMock);

  return didIntersectMock;
}
