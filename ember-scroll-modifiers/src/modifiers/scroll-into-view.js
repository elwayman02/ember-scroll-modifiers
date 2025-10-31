import { modifier } from 'ember-modifier';

export default modifier(scrollIntoView, { eager: false });

/**
 * Modifier that scrolls an element into view.
 * You may specify top or left offset to use `scrollTo` instead of default `scrollIntoView`.
 * You may also let it focus on an element after scrolling. If focus selector is not provided,
 * it will focus on the first focusable element found.
 * @param {Element} element - Element to scroll into view
 * @param {Array} positional - Positional arguments passed to the modifier
 * @param {Object} named - Named arguments passed to the modifier
 * @param {boolean} named.shouldScroll - Whether to scroll the element into view
 * @param {Object} named.options - Options to pass to `scrollIntoView` or `scrollTo`
 * @param {string} named.options.behavior - Scroll behavior to pass to `scrollIntoView` or `scrollTo`
 * @param {number} named.options.topOffset - Top offset to pass to `scrollTo`
 * @param {number} named.options.leftOffset - Left offset to pass to `scrollTo`
 * @param {string} named.options.scrollContainerId - Id of the scroll container to pass to `scrollTo`
 * @param {boolean} named.shouldFocusAfterScroll - Whether to focus on an element after scrolling
 * @param {string} named.focusSelector - Selector to find the element to focus on after scrolling
 * @returns {Function} - Function to remove the modifier
 * @example
 * ```hbs
 *   <div {{scroll-into-view shouldScroll=true}}/>
 *   <div {{scroll-into-view shouldScroll=true options=(hash behavior="smooth")}}/>
 *   <div {{scroll-into-view shouldScroll=true options=(hash behavior="smooth" topOffset=25 leftOffset=25)}}/>
 *   <div {{scroll-into-view shouldScroll=true shouldFocusAfterScroll=true}}/>
 *   <div {{scroll-into-view shouldScroll=true shouldFocusAfterScroll=true focusSelector="input[aria-invalid='true']"}}/>
 * ```
 */
function scrollIntoView(element, positional, named = {}) {
  const { options, shouldScroll, shouldFocusAfterScroll, focusSelector } =
    named;
  const DEFAULT_FOCUSABLE_ELEMENTS = [
    'button:not(:disabled)',
    '[href]',
    'input:not(:disabled)',
    'select:not(:disabled)',
    'textarea:not(:disabled)',
    '[tabindex]:not([tabindex="-1"]):not(:disabled)',
  ];
  let hasBeenRemoved;

  const shouldScrollPromise = Promise.resolve(shouldScroll);

  shouldScrollPromise.then((shouldScrollValue) => {
    if (shouldScrollValue && element && !hasBeenRemoved) {
      let { behavior = 'auto' } = options || {};
      behavior =
        behavior === 'smooth' &&
        window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
          ? 'instant'
          : behavior;
      if (
        options?.topOffset === undefined &&
        options?.leftOffset === undefined
      ) {
        element.scrollIntoView({
          ...options,
          ...(options?.behavior && { behavior }),
        });
      } else {
        const { topOffset, leftOffset, scrollContainerId } = options;

        let scrollContainer, left, top;
        if (scrollContainerId !== undefined) {
          scrollContainer = document.getElementById(scrollContainerId);
          left =
            element.offsetLeft - scrollContainer.offsetLeft - (leftOffset ?? 0);
          top =
            element.offsetTop - scrollContainer.offsetTop - (topOffset ?? 0);
        } else {
          scrollContainer = window;
          left =
            leftOffset === undefined
              ? 0
              : element.getBoundingClientRect().left -
                document.body.getBoundingClientRect().left -
                leftOffset;
          top =
            topOffset === undefined
              ? 0
              : element.getBoundingClientRect().top -
                document.body.getBoundingClientRect().top -
                topOffset;
        }

        scrollContainer?.scrollTo({
          behavior,
          top,
          left,
        });
      }
      if (shouldFocusAfterScroll) {
        let focusElement;
        if (typeof focusSelector === 'string') {
          focusElement = element.querySelector(focusSelector);
        }
        // When provided focusable element doesn't exist, fallback to first focusable element
        focusElement =
          focusElement ??
          element.querySelector(DEFAULT_FOCUSABLE_ELEMENTS.join(', '));
        if (focusElement) {
          // Prevent scrolling while setting focus to avoid overriding the above scroll behavior.
          focusElement.focus({ preventScroll: true });
        }
      }
    }
  });

  return () => {
    hasBeenRemoved = true;
  };
}
