# did-intersect

This modifier triggers a callback when intersection events are observed on the target element.

Powered by [`intersection-observer-admin`](https://github.com/snewcomer/intersection-observer-admin) for performance.

## When you should use this modifier

You should use this modifier whenever you need to monitor if an element is intersecting another element or the viewport itself.
It might be useful for implementing features like showing/hiding sticky header, highlighting element(s) when intersected, and tracking.

You **should not** use this modifier until you've exhausted all native solutions. Native solutions based on `html` and `css` should always
be prioritized when reasonable. For example, a basic sticky header can be implemented using just `position: sticky` in your `css`.

## Basic Usage

`did-intersect` expects at least one of the 2 callback handlers, `onEnter` and `onExit`::

```handlebars{data-execute=false}
<div {{did-intersect onEnter=this.onEnteringIntersection onExit=this.onExitingIntersection}}></div>
```

The handler will be called with an instance of [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)

```javascript
@action
onEnteringIntersection(entry) {
  // do something
}
```

You can also set a maximum limit on the number of times the callbacks should trigger for each `onEnter` and `onExit` via `maxEnter` and `maxExit` respectively. By default, there is no limit.

**Note:** This function passes over a single element `entry` compared to the vanilla `IntersectionObserver` API that sends an array of elements.

## Advanced Usage

### Options

`did-intersect` also supports passing an `options` object into IntersectionObserver:

```handlebars{data-execute=false}
  <div {{did-intersect onEnter=this.onEnteringIntersection options=(hash rootMargin='-100px' threshold=1)}}></div>
```

The options supported are documented in the MDN site under [Intersection observer options](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#Intersection_observer_options).

### Other arguments

Besides `onEnter`, `onExit`, and `options`, `{{did-intersect}}` accepts the following named arguments:

- `maxEnter`: a maximum number of times to allow the `IntersectionObserver` to be triggered for entering the viewport

- `maxExit`: a maximum number of times to allow the `IntersectionObserver` to be triggered for entering the viewport

- `isObserving`: whether to allow the `IntersectionObserver` to trigger at all. Useful for times when you want to programmatically control enabling and disabling observation of an element based on some tracked state in your own code.

## Testing

Since the underlying IntersectionObserver behavior is non-deterministic, we provide a `did-intersect-mock` test helper to help you test `did-intersect` deterministically.

`did-intersect-mock` creates a mock provides 2 APIs

1. `enter(elementString)` triggers the `onEnter` callback, given an DOM element string
2. `exit(elementString)` triggers the `onExit` callback, given an DOM element string

```javascript
import mockDidIntersect from 'ember-scroll-modifiers/test-support/did-intersect-mock';

...
const didIntersectMock = mockDidIntersect(sinon);

await render(hbs`
  <div
    data-test-did-intersect
    {{did-intersect onEnter=this.onEnteringIntersection onExit=this.onExitingIntersection}}
  >
  </div>
`)
...
await didIntersectMock.enter('[data-test-did-intersect]');
...
await didIntersectMock.exit('[data-test-did-intersect]');
```

Even though, this effectively allows you to trigger the `did-intersect` on demand without requiring real app interactions, you should still do it as best practice.

```javascript
...
await triggerEvent('[data-test-root-element-selector]', 'scroll');
await didIntersectMock.enter('[data-test-did-intersect]');
...
```

You can also construct and pass you own IntersectionObserverEntry, `enter(elementString, IntersectionObserverEntry)`, `exit(elementString, IntersectionObserverEntry)`

```javascript
...
await didIntersectMock.enter('[data-test-did-intersect]', {time: 100});
await didIntersectMock.exit('[data-test-did-intersect]', {time: 100});
...
```

## Browser Support

This feature is [supported](https://caniuse.com/#search=intersectionobserver) in the latest versions of every browser except IE 11.
In browsers where IntersectionObserver is not supported, this modifier becomes a no-op. It will not error,
nor will it employ a fallback. Features built with this addon will simply gracefully not respond to intersection events.

[Polyfilling](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) is possible, but unrecommended.
