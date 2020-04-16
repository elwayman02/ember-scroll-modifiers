import Modifier from 'ember-modifier';

export default class DidIntersectModifier extends Modifier {
  // Public API
  handler = null;
  threshold = [1];

  // Private API
  observer = null;

  observe() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        this.handler(entries[0]);
      }, {threshold: this.threshold});

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
    let [handler, threshold] = this.args.positional;

    // Save arguments for when we need them
    this.handler = handler;
    this.threshold = threshold || this.threshold;

    this.observe();
  }

  willRemove() {
    this.unobserve();
  }
}
