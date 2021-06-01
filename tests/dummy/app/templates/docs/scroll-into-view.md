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


## Browser Support

This feature is [supported](https://caniuse.com/?search=scrollIntoView) in the latest versions of every browser.
