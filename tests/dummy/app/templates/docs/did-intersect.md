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

`did-intersect` also supports passing an `threshold` number or array into IntersectionObserver:

```handlebars{
  <div {{did-resize this.onIntersection this.thresholds}}></div>
```

The threshold options supported are documented under [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver).

## Browser Support

This feature is [supported](https://caniuse.com/#search=intersectionobserver) in the latest versions of every browser except IE 11.
In browsers where IntersectionObserver is not supported, this modifier becomes a no-op. It will not error, 
nor will it employ a fallback. Features built with this addon will simply gracefully not respond to intersection events.
