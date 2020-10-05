# did-intersect

This modifier triggers a callback when intersection events are observed on the target element.

Powered by [`intersection-observer-admin`](https://github.com/snewcomer/intersection-observer-admin)  for performance.

## When you should use this modifier

You should use this modifier whenever you need to monitor if an element is intersecting another element or the viewport itself.
It might be useful for implementing features like showing/hiding sticky header, highlighting element(s) when intersected, and tracking.

You **should not** use this modifier until you've exhausted all native solutions. Native solutions based on `html` and `css` should always
be prioritized when reasonable. For example, a basic sticky header can be implemented using just `position: sticky` in your `css`.

## Basic Usage

`did-intersect` expects at least one of the 2 callback handlers, `onEnter` and `onExit`::

```handlebars
<div {{did-intersect onEnter=this.onEnteringIntersection onExit=this.onExitingIntersection}}></div>
```

The handler will be called with an instance of [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)

```javascript
@action
onEnteringIntersection(entry) {
  // do something
}
```

**Note:** This function passes over a single element `entry` compared to the vanilla `IntersectionObserver` API that sends an array of elements.

## Advanced Usage

`did-intersect` also supports passing an `options` object into IntersectionObserver:

```handlebars
  <div {{did-intersect onEnter=this.onEnteringIntersection options=(hash rootMargin='-100px' threshold=1)}}></div>
```

The options supported are documented in the MDN site under [Intersection observer options](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#Intersection_observer_options).

## Browser Support

This feature is [supported](https://caniuse.com/#search=intersectionobserver) in the latest versions of every browser except IE 11.
In browsers where IntersectionObserver is not supported, this modifier becomes a no-op. It will not error,
nor will it employ a fallback. Features built with this addon will simply gracefully not respond to intersection events.

[Polyfilling](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) is possible, but unrecommended.
