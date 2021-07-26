# scroll-into-view

This modifier calls `scrollIntoView` on the modified element.


## When you should use this modifier

You should use this modifier whenever you need to have an element scrolled into view on element insert.


## Basic Usage

`scroll-into-view` expects the named `shouldScroll` parameter and an optional `options` named parameter. See [scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) for the list of possible values and properties of `options`.

```handlebars
<div {{scroll-into-view shouldScroll=this.shouldScrollPromise options=true}}></div>
```

`shouldScroll` can be either a Boolean or a Promise that resolves to a truthy or falsy value. It does not handle a rejected Promise.


## Testing
`scroll-into-view-mock` provides a function that will mock the native browser `scrollIntoView` and allow testing which elements invoked the modifier

`mockScrollIntoView()` - will mock the native API and return an object with the following 2 functions
* `scrollIntoViewCalledWith(Element|DOM selector)` - tests if the modifier was invoked on the element
* `resetMock()` - restores the native scrollIntoView function

```javascript
import mockScrollIntoView from 'ember-scroll-modifiers/test-support/scroll-into-view-mock';
...
hooks.beforeEach(function () {
  this.mockHelperFunctions = mockScrollIntoView();
});

hooks.afterEach(function () {
  this.mockHelperFunctions.resetMock();
});
...
function('test scroll into view', (assert) => {
  ...
  await render(
    hbs`<div {{scroll-into-view shouldScroll=true}} data-test-scroll-into-view-selector></div>`
  );
  ...
  assert.ok(this.mockHelperFunctions.scrollIntoViewCalledWith('[data-test-scroll-into-view-selector]'), 'element scrolled into view');
});
```


## Browser Support

This feature is [supported](https://caniuse.com/?search=scrollIntoView) in the latest versions of every browser.
