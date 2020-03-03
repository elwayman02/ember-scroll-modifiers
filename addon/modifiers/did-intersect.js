import Modifier from 'ember-modifier';
import { run } from '@ember/runloop';

export default class DidIntersectModifier extends Modifier {
  // Public API
  handler = null;
  threshold = [1];

  // Private API
  observer = null;

  observe() {
    this.observer = new IntersectionObserver((entries) => {
      this.handler(entries[0]);
    }, { threshold: this.threshold });

    run.end();
    this.observer.observe(this.element);
  }

  unobserve() {
    this.observer.disconnect();
  }

  didUpdateArguments() {
    this.unobserve();
  }

  didReceiveArguments() {
    run.begin();

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
