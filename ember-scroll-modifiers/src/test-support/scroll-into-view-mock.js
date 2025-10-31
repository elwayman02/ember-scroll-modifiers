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

    if (options?.topOffset === undefined && options?.leftOffset === undefined) {
      return elementsInvokedOn.includes(element);
    }

    if (!element || !document) {
      return;
    }
    const { behavior = 'smooth', leftOffset, topOffset } = options;

    const elementLeft =
      leftOffset === undefined
        ? 0
        : element.getBoundingClientRect().left -
          document.body.getBoundingClientRect().left -
          leftOffset;

    const elementTop =
      topOffset === undefined
        ? 0
        : element.getBoundingClientRect().top -
          document.body.getBoundingClientRect().top -
          topOffset;

    return elementsInvokedOn.some((calledOptions) => {
      return (
        behavior === calledOptions.behavior &&
        elementTop === calledOptions.top &&
        elementLeft === calledOptions.left
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
