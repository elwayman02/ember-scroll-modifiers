import { find } from '@ember/test-helpers';

export default function mockScrollIntoView() {
  let elementsInvokedOn = [];
  let mockScrollIntoViewFunction = function () {
    elementsInvokedOn.push(this);
  };
  // maually mocking native function
  let preExistingScrollFunction = window.Element.prototype.scrollIntoView;
  window.Element.prototype.scrollIntoView = mockScrollIntoViewFunction;
  // helper fuctions that will be returned
  let scrollIntoViewCalledWith = (selector) => {
    let element;
    // check if it's a string and get the object
    if (typeof selector === 'string') {
      element = find(selector);
    } else {
      // element was passed in
      element = selector;
    }
    return elementsInvokedOn.includes(element);
  };

  let resetMock = () => {
    window.Element.prototype.scrollIntoView = preExistingScrollFunction;
  };

  return {
    scrollIntoViewCalledWith,
    resetMock,
  };
}
