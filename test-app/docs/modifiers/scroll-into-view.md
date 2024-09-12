# scroll-into-view

This modifier scrolls to the associated element. By default it uses `scrollIntoView`, but if a top or left offset is passed as an option it uses `scrollTo` and calculates the `options.top` and/or `options.left` attribute.


## When you should use this modifier

You should use this modifier whenever you need to have an element scrolled into view. If there is a element, such as a fixed header or sidebar, passing in a `topOffset` or `leftOffset` will scroll to the element minus the that offset value.



## Basic Usage

`scroll-into-view` expects the named `shouldScroll` parameter and an optional `options` named parameter. See [scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) for the list of possible values and properties of `options`.


```handlebars
  <div {{scroll-into-view shouldScroll=this.shouldScroll options=(hash behavior="smooth")}}>
    <button type="button" {{on "click" this.onScrollIntoView}}>
      Trigger scroll-into-view on click
    </button>
  </div>
```

`shouldScroll` can be either a Boolean or a Promise that resolves to a truthy or falsy value. It does not handle a rejected Promise.

### Usage with focus

When passing in `shouldFocusAfterScroll` as true, it will set focus to the first focusable element found.

```handlebars
  <div {{scroll-into-view shouldScroll=this.shouldScrollWithFocus options=(hash behavior="smooth") shouldFocusAfterScroll=this.shouldFocusAfterScroll}}>
    <div>
      <label for="firstFocusableElement">First Focusable Element: </label>
      <input name="firstFocusableElement" type="text">
    </div>
    <button type="button" {{on "click" this.onScrollIntoViewWithFocus}}>
      Trigger scroll-into-view and set focus on click
    </button>
  </div>
```
> Warning: While setting focus, `scroll-into-view` tries to prevent overriding its scroll behavior via [preventScroll](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#preventscroll). However, it is not guaranteed in browsers that do not [support](https://caniuse.com/mdn-api_htmlelement_focus_options_preventscroll_parameter) `preventScroll`. As such, page will scroll to the focused element and `smooth` scroll behavior will be lost in such cases.

### Usage with focus element

When passing in `shouldFocusAfterScroll` as true and `focusSelector`, it will set focus to the given focusable element.

```handlebars
  <div {{scroll-into-view shouldScroll=this.shouldScrollWithFocusElement options=(hash behavior="smooth") shouldFocusAfterScroll=this.shouldFocusAfterScrollWithFocusElement focusSelector="select:not(:disabled)"}}>
    <button type="button" {{on "click" this.onScrollIntoViewWithFocusElement}}>
      Trigger scroll-into-view and set focus on given element on click
    </button>
    <div>
      <label for="givenFocusableElement">Given Focusable Element: </label>
      <select name="givenFocusableElement">
        <option>Item 1</option>
        <option>Item 2</option>
      </select>
    </div>
  </div>
```

### Usage with offset

When passing in an offset, it will call [scrollTo](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo), and the `options` parameter is designed to correspond to its `options`. The `options.behavior` operates the same, however, instead of `top` and `left` there are `topOffset` and `leftOffset`, respectively. As with `top` and `left`, `topOffset` and `leftOffset` are in pixels. If an offset value is not set then the value passed to `scrollTo` is 0, e.g. `options = { topOffset: 10 }` results in `element.scrollTo({ top: [computedValue], left: 0 })`. Experiment with the below example, you may need to zoom and resize the window to see a horizontal scrollbar.


```handlebars
  <div {{scroll-into-view shouldScroll=this.shouldScrollWithOffset options=(hash topOffset=this.topOffset leftOffset=this.leftOffset behavior="smooth")}}>
    <div>
      <label for="topOffset">Top Offset: </label>
      <input name="topOffset" type="number" value={{this.topOffset}} {{on "change" this.onTopOffsetChange}}>
    </div>
    <div>
      <label for="leftOffset">Left Offset: </label>
      <input name="leftOffset" type="number" value={{this.leftOffset}} {{on "change" this.onLeftOffsetChange}}>
    </div>
    <button type="button" {{on "click" this.onScrollIntoViewWithOffset}}>
      Trigger scroll-into-view with offset on click
    </button>
  </div>
```

`shouldScroll` can be either a Boolean or a Promise that resolves to a truthy or falsy value. It does not handle a rejected Promise.

A custom scroll container id can be passed. This allows scrolling in nested scroll containers with an offset instead of the main window.

```handlebars
  <div>
    <label for="topOffset">Top Offset: </label>
    <input name="topOffset" type="number" value={{this.topOffsetCustom}} {{on "change" this.onTopOffsetChangeCustom}}>
  </div>
  <div id="custom-scroll-container" style="width: 200px; height: 150px; overflow-y: scroll;">
    <div style="background-color: red; height: 100px;">Item 1</div>
    <div style="background-color: green; height: 100px;">Item 2</div>
    <div
      style="background-color: blue; height: 100px;"
      {{scroll-into-view shouldScroll=this.shouldScrollWithCustom options=(hash topOffset=this.topOffsetCustom scrollContainerId='custom-scroll-container')}}
    >
      Item 3
    </div>
    <div style="background-color: yellow; height: 100px;">Item 4</div>
    <div style="height: 100px;">Item 5</div>
  </div>
  <button type="button" {{on "click" this.onScrollIntoViewWithCustom}}>
    Trigger scroll-into-view with offset on click
  </button>
```


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

function('test scroll into view with offset', (assert) => {
  ...
  await render(
    hbs`<div {{scroll-into-view shouldScroll=true options=(hash offset=25)}} data-test-scroll-into-view-selector></div>`
  );
  ...
  assert.ok(this.mockHelperFunctions.scrollIntoViewCalledWith('[data-test-scroll-into-view-selector]', { behavior: 'smooth', top: 25, left: 0 }), 'scrolled to element');
});
```


## Browser Support

This feature is [supported](https://caniuse.com/?search=scrollIntoView) in the latest versions of every browser.
This feature is [supported](https://caniuse.com/?search=scrollTo) in the latest versions of every browser.
