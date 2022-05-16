import { modifier } from 'ember-modifier';

export default modifier(function scrollToElementWithOffset(
  element,
  positional,
  named = {}
) {
  const { options = {}, shouldScroll } = named;
  let hasBeenRemoved;

  const shouldScrollPromise = Promise.resolve(shouldScroll);

  shouldScrollPromise.then((shouldScrollValue) => {
    if (shouldScrollValue && element && window && !hasBeenRemoved) {
      const { behavior = 'smooth', offset = 0, left = 0 } = options;

      window.scrollTo({
        behavior,
        top:
          element.getBoundingClientRect().top -
          document.body.getBoundingClientRect().top -
          offset,
        left,
      });
    }
  });

  return () => {
    hasBeenRemoved = true;
  };
});
