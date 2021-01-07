import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';

export const DEFAULT_OBSERVER_OPTIONS = {};

export default class DidIntersectModifier extends Modifier {
  @service('ember-scroll-modifiers@observer-manager') observerManager;

  // A flag that determines if we should use intersection observer or use no-op, e.g IE11, no polyfill.
  _isObservable = 'IntersectionObserver' in window;

  // Observer options need to be specified, so the intersection observer admin service can use it as a key to unobserve, in case there is multiple observers on the same element. By default, we're using the same options that intersection observer uses.
  _options = DEFAULT_OBSERVER_OPTIONS;

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

  didUpdateArguments() {
    this.unobserve();
  }

  didReceiveArguments() {
    if (!this._isObservable) {
      return;
    }

    let { onEnter, onExit, options } = this.args.named;

    assert('onEnter or/and onExit is required', onEnter || onExit);

    if (onEnter) {
      this.observerManager.addEnterCallback(this.element, onEnter);
    }
    if (onExit) {
      this.observerManager.addExitCallback(this.element, onExit);
    }

    if (options) {
      this._options = options;
    }

    this.observe();
  }

  // Move to willDestroy when we want to drop support for versions below ember-modifier 2.x
  willRemove() {
    this.unobserve();
  }
}
