import { find } from '@ember/test-helpers';

export default function mockScrollToElementWithOffset() {
  let optionsCalledWith = [];
  let mockScrollToElementWithOffsetFunction = function (options) {
    optionsCalledWith.push(options);
  };
  // manually mocking native function
  let preExistingScrollFunction = window.scrollTo;
  window.scrollTo = mockScrollToElementWithOffsetFunction;

  // helper fuctions that will be returned
  let scrollToCalledWith = (element, options = {}) => {
    if (!element || !document) {
      return;
    }

    if (typeof element === 'string') {
      element = find(element);
    }

    const { behavior = 'smooth', offset = 0, left = 0 } = options;

    const elementTop =
      element.getBoundingClientRect().top -
      document.body.getBoundingClientRect().top -
      offset;

    return optionsCalledWith.some((calledOptions) => {
      return (
        behavior === calledOptions.behavior &&
        elementTop === calledOptions.top &&
        left === calledOptions.left
      );
    });
  };

  let resetMock = () => {
    window.Element.prototype.scrollIntoView = preExistingScrollFunction;
  };

  return {
    scrollToCalledWith,
    resetMock,
  };
}
