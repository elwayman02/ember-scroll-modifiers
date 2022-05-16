# scroll-to-element-with-offset

This modifier calls `scrollTo` on the window, setting `options.top` parameter to the top of the target element minus a desired offset.


## When you should use this modifier

You should use this modifier whenever you want to scroll to an element, but need to set an offset (e.g. when there is a fixed navigation menu). If you do not need to set an offset value, then use the `scroll-into-view` modifier.


## Basic Usage

`scroll-to-element-with-offset` expects the named `shouldScroll` parameter and an optional `options` named parameter. See [scrollTo](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo) for the list of possible values and properties of `options`.

```handlebars
  <div {{scroll-to-element-with-offset shouldScroll=this.shouldScroll options=(hash offset=this.offset)}}>
    <input type="number" value={{this.offset}} {{on "change" this.onOffsetChange}}>
    <button type="button" {{on "click" this.onScrollToElementWithOffset}}>
      Trigger scroll-to-element-with-offset on click
    </button>
  </div>
```

`shouldScroll` can be either a Boolean or a Promise that resolves to a truthy or falsy value. It does not handle a rejected Promise.


## Testing
`scroll-to-element-with-offset-mock` provides a function that will mock the native browser `scrollTo` and allow testing which elements invoked the modifier

`mockScrollTo()` - will mock the native API and return an object with the following 2 functions
* `scrollToCalledWith(Element|DOM selector, options)` - tests if the modifier was invoked on the element. The options param is optional, and checks against values passed into the modifier.
* `resetMock()` - restores the native scrollTo function

```javascript
import mockScrollTo from 'ember-scroll-modifiers/test-support/scroll-to-element-with-offset-mock';
...
hooks.beforeEach(function () {
  this.mockHelperFunctions = mockScrollTo();
});

hooks.afterEach(function () {
  this.mockHelperFunctions.resetMock();
});
...
function('test scroll-to-element-with-offset', (assert) => {
  ...
  await render(
    hbs`<div {{scroll-to-element-with-offset shouldScroll=true options=(hash offset=25)}} data-test-scroll-to-element-with-offset-selector></div>`
  );
  ...
  assert.ok(this.mockHelperFunctions.scrollToCalledWith('[data-test-scroll-to-element-with-offset-selector]', { behavior: 'smooth', top: 25, left: 0 }), 'scrolled to element');
});
```


## Browser Support

This feature is [supported](https://caniuse.com/?search=scrollTo) in the latest versions of every browser.
