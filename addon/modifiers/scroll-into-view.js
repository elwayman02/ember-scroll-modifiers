import { modifier } from 'ember-modifier';

export default modifier(function scrollIntoView(
  element,
  positional,
  named = {}
) {
  const { options, shouldScroll } = named;
  let hasBeenRemoved;

  const trustedPromise = Promise.resolve(shouldScroll);

  trustedPromise.then((result) => {
    if (result && element && !hasBeenRemoved) {
      element.scrollIntoView(options);
    }
  });

  return () => {
    hasBeenRemoved = true;
  };
});
