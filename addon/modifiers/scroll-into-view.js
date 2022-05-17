import { modifier } from 'ember-modifier';

export default modifier(function scrollIntoView(
  element,
  positional,
  named = {}
) {
  const { options, shouldScroll } = named;
  let hasBeenRemoved;

  const shouldScrollPromise = Promise.resolve(shouldScroll);

  shouldScrollPromise.then((shouldScrollValue) => {
    if (shouldScrollValue && element && !hasBeenRemoved) {
      if (!options?.offset) {
        element.scrollIntoView(options);
      } else {
        const { behavior = 'auto', offset = 0, left = 0 } = options;

        window?.scrollTo({
          behavior,
          top:
            element.getBoundingClientRect().top -
            document.body.getBoundingClientRect().top -
            offset,
          left,
        });
      }
    }
  });

  return () => {
    hasBeenRemoved = true;
  };
});
