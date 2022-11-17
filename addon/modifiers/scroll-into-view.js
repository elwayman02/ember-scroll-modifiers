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

        const scrollContainer =
          scrollContainerId !== undefined
            ? document.getElementById(scrollContainerId)
            : window;
        let left, top;
        if (scrollContainerId !== undefined) {
          left =
            element.offsetLeft - scrollContainer.offsetLeft - (leftOffset ?? 0);
          top =
            element.offsetTop - scrollContainer.offsetTop - (topOffset ?? 0);
        } else {
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
    }
  });

  return () => {
    hasBeenRemoved = true;
  };
});
