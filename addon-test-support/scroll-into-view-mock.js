import { find } from '@ember/test-helpers';

export default function mockScrollIntoView() {
  let elementsInvokedOn = [];
  let mockScrollIntoViewFunction = function () {
    elementsInvokedOn.push(this);
  };

  let mockScrollToElementWithOffsetFunction = function (options) {
    elementsInvokedOn.push(options);
  };

  // manually mocking native function
  let preExistingScrollIntoViewFunction =
    window.Element.prototype.scrollIntoView;
  let preExistingScrollToFunction = window.scrollTo;
  window.Element.prototype.scrollIntoView = mockScrollIntoViewFunction;
  window.scrollTo = mockScrollToElementWithOffsetFunction;

  // helper fuctions that will be returned
  let scrollIntoViewCalledWith = (selector, options = {}) => {
    let element;
    // check if it's a string and get the object
    if (typeof selector === 'string') {
      element = find(selector);
    } else {
      // element was passed in
      element = selector;
    }

    if (!options.offset) {
      return elementsInvokedOn.includes(element);
    }

    if (!element || !document) {
      return;
    }
    const { behavior = 'smooth', offset = 0, left = 0 } = options;

    const elementTop =
      element.getBoundingClientRect().top -
      document.body.getBoundingClientRect().top -
      offset;

    return elementsInvokedOn.some((calledOptions) => {
      return (
        behavior === calledOptions.behavior &&
        elementTop === calledOptions.top &&
        left === calledOptions.left
      );
    });
  };

  let resetMock = () => {
    window.Element.prototype.scrollIntoView = preExistingScrollIntoViewFunction;
    window.scrollTo = preExistingScrollToFunction;
  };

  return {
    scrollIntoViewCalledWith,
    resetMock,
  };
}
