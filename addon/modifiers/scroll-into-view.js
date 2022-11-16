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
        const {
          behavior = 'auto',
          topOffset,
          leftOffset,
          scrollContainerId,
        } = options;

        let top = topOffset;
        let left = leftOffset;
        if (scrollContainerId === undefined) {
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

        const scrollContainer =
          scrollContainerId !== undefined
            ? document.getElementById(scrollContainerId)
            : window;

        scrollContainer?.scrollTo({
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
