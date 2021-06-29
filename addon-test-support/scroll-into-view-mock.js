import sinon from 'sinon';
import { find } from '@ember/test-helpers';
export default function setupScrollIntoView(hooks) {
  hooks.beforeEach(function () {
    this.scrollIntoViewSandbox = sinon.createSandbox();
    const scrollIntoViewMock = this.scrollIntoViewSandbox.stub();
    this.scrollIntoViewSandbox.replace(
      window.Element.prototype,
      'scrollIntoView',
      scrollIntoViewMock
    );
    // function will check if the passed selector matches any of the elements
    this.scrollIntoViewCalledWith = (selector) => {
      let element;
      // check if it's a string and get the object
      if (typeof selector === 'string') {
        element = find(selector);
      } else {
        // element was passed in
        element = selector;
      }
      const elementsScrolledTo = scrollIntoViewMock
        .getCalls()
        .map((call) => call.thisValue);
      return elementsScrolledTo.includes(element);
    };
  });
  hooks.afterEach(function () {
    this.scrollIntoViewSandbox.restore();
  });
}
