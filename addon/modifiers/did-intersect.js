import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';

export default class DidIntersectModifier extends Modifier {
  @service('ember-scroll-modifiers@observer-manager') observerManager;

  // A flag that determines if we should use intersection observer or use no-op, e.g IE11, no polyfill.
  _isObservable = 'IntersectionObserver' in window;

  observe(options) {
    if (!this._isObservable) {
      return;
    }

    this.observerManager.observe(this.element, options);
  }

  unobserve() {
    if (!this._isObservable) {
      return;
    }
    this.observerManager.unobserve(this.element);
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

    this.observe(options || this.options);
  }

  willDestroy() {
    this.unobserve();
  }
}
