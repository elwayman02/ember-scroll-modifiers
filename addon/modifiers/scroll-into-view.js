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
      if (
        options?.topOffset === undefined &&
        options?.leftOffset === undefined
      ) {
        element.scrollIntoView(options);
      } else {
        const { behavior = 'auto', topOffset, leftOffset } = options;

        const left =
          leftOffset === undefined
            ? 0
            : element.getBoundingClientRect().left -
              document.body.getBoundingClientRect().left -
              leftOffset;

        const top =
          topOffset === undefined
            ? 0
            : element.getBoundingClientRect().top -
              document.body.getBoundingClientRect().top -
              topOffset;

        window?.scrollTo({
          behavior,
          top,
          left,
        });
      }
    }
  });

  return () => {
    hasBeenRemoved = true;
  };
});
