import Modifier from 'ember-modifier';

export default class DidIntersectModifier extends Modifier {
  // Public API
  handler = null;
  options = {};

  // Private API
  observer = null;

  observe() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries, observer) => {
        this.handler(entries[0], observer);
      }, this.options);

      this.observer.observe(this.element);
    }
  }

  unobserve() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  didUpdateArguments() {
    this.unobserve();
  }

  didReceiveArguments() {
    let [handler, options] = this.args.positional;

    // Save arguments for when we need them
    this.handler = handler;
    this.options = options || this.options;

    this.observe();
  }

  willRemove() {
    this.unobserve();
  }
}
