# did-intersect

This modifier triggers a callback when intersection events are observed on the target element.

## Basic Usage

A callback handler is always expected to be passed to `did-intersect`:

```handlebars
  <div {{did-intersect this.onIntersection}}></div>
```

The handler will be called with an instance of [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)
and the [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver) instance itself:

```javascript
  onIntersection(entry, observer) {
    // do something
  }
```

## Advanced Usage

`did-intersect` also supports passing an `options` object into IntersectionObserver:

```handlebars
  <div {{did-intersect this.onIntersection (hash rootMargin='-100px' threshold=1)}}></div>
```

The options supported are documented in the MDN site under [Intersection observer options](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#Intersection_observer_options).

## Browser Support

This feature is [supported](https://caniuse.com/#search=intersectionobserver) in the latest versions of every browser except IE 11.
In browsers where IntersectionObserver is not supported, this modifier becomes a no-op. It will not error, 
nor will it employ a fallback. Features built with this addon will simply gracefully not respond to intersection events.
