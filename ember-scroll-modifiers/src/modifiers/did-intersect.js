import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';

export const DEFAULT_OBSERVER_OPTIONS = {};

function cleanup(instance) {
  instance.unobserve.call(instance);
}

export default class DidIntersectModifier extends Modifier {
  @service('ember-scroll-modifiers@observer-manager') observerManager;

  onEnter;

  onExit;

  // A flag that determines if we should use intersection observer or use no-op, e.g IE11, no polyfill.
  _isObservable = 'IntersectionObserver' in window;

  // Observer options need to be specified, so the intersection observer admin service can use it as a key to unobserve, in case there is multiple observers on the same element. By default, we're using the same options that intersection observer uses.
  _options = DEFAULT_OBSERVER_OPTIONS;

  // Used to track number of enter and exit intersections that have happened.
  @tracked
  _numOfEnters = 0;

  @tracked
  _numOfExits = 0;

  @tracked
  _maxEnterIntersections;

  @tracked
  _maxExitIntersections;

  // Track if we have already initialized `addEnterCallback` or `addExitCallback`
  _hasSetupEnterCallback = false;

  _hasSetupExitCallback = false;

  // the element
  element;

  constructor(owner, args) {
    super(owner, args);
    registerDestructor(this, cleanup);
  }

  get _isExceedingMaxEnters() {
    if (!Number.isInteger(this._maxEnterIntersections)) {
      return false;
    }

    return this._numOfEnters > this._maxEnterIntersections;
  }

  get _isExceedingMaxExits() {
    if (!Number.isInteger(this._maxExitIntersections)) {
      return false;
    }

    return this._numOfExits > this._maxExitIntersections;
  }

  observe() {
    if (!this._isObservable) {
      return;
    }

    this.observerManager.observe(this.element, this._options);
  }

  unobserve() {
    if (!this._isObservable) {
      return;
    }

    this.observerManager.unobserve(this.element, this._options);
  }

  modify(element, positional, named) {
    this.element = element;

    if (!this._isObservable) {
      return;
    }

    let {
      onEnter,
      onExit,
      maxEnter,
      maxExit,
      options,
      isObserving = true,
    } = named;

    assert('onEnter or/and onExit is required', onEnter || onExit);

    if (onEnter) {
      assert('onEnter must be a function', typeof onEnter === 'function');
      this.onEnter = onEnter;
    }

    if (onExit) {
      assert('onExit must be a function', typeof onExit === 'function');
      this.onExit = onExit;
    }

    // We should technically accept 0, in case of programmatic changes
    if (maxEnter || maxEnter === 0) {
      assert('maxEnter must be an integer', Number.isInteger(maxEnter));
      this._maxEnterIntersections = maxEnter;
    }

    // We should accept 0 here too.
    if (maxExit || maxExit === 0) {
      assert('maxExit must be an integer', Number.isInteger(maxExit));
      this._maxExitIntersections = maxExit;
    }

    if (
      !this._hasSetupEnterCallback &&
      this.onEnter &&
      !this._isExceedingMaxEnters
    ) {
      this.observerManager.addEnterCallback(this.element, (...args) => {
        if (this.isDestroying) {
          return;
        }

        this._numOfEnters++;

        if (
          this._isExceedingMaxEnters &&
          (!this.onExit || this._isExceedingMaxExits)
        ) {
          this.unobserve();
          return;
        }

        if (!this._isExceedingMaxEnters) {
          this.onEnter(...args);
        }
      });
      this._hasSetupEnterCallback = true;
    }

    if (
      !this._hasSetupExitCallback &&
      this.onExit &&
      !this._isExceedingMaxExits
    ) {
      this.observerManager.addExitCallback(this.element, (...args) => {
        if (this.isDestroying) {
          return;
        }

        this._numOfExits++;

        if (
          (!this.onEnter || this._isExceedingMaxEnters) &&
          this._isExceedingMaxExits
        ) {
          this.unobserve();
          return;
        }

        if (!this._isExceedingMaxExits) {
          this.onExit(...args);
        }
      });
      this._hasSetupExitCallback = true;
    }

    if (options) {
      this._options = options;
    }

    if (isObserving) {
      this.observe();
    } else {
      this.unobserve();
    }
  }
}
