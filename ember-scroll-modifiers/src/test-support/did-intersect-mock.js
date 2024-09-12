import { A as emberArray } from '@ember/array';
import { settled, find } from '@ember/test-helpers';
import sinon from 'sinon';

/**
 * This replaces the browser's IntersectionObserver with a mocked one that is synchronous
 * as opposed to asynchronous, and controllable by us.
 *
 * forceElement return `settled()` for convenience, so that
 * any downstream side-effects can be awaited. This is also done for consistency with
 * the rest of our test helpers.
 *
 * Usage:
 *
 * const didIntersectMock = mockDidIntersect(sinon);
 * ...render logic...
 * await didIntersectMock.enter();
 */
class MockIntersectionObserver {
  static instances = [];

  constructor(callback) {
    this.callback = callback;
    this._watchedElements = emberArray();
    MockIntersectionObserver.instances.push(this);
  }

  observe(element) {
    this._watchedElements.addObject(element);
  }

  unobserve(element) {
    this._watchedElements.removeObject(element);
  }

  disconnect() {
    this._watchedElements = [];
  }

  /**
   * Force a single element to enter the viewport
   * @param {String} el - a DOM selector string
   * @param {IntersectionObserverEntry} [state] Additional state to be passed as the IntersectionObserverEntry
   */
  static enter(el, state) {
    return MockIntersectionObserver.forceElement(find(el), {
      isIntersecting: true,
      intersectionRatio: 1,
      ...state,
    });
  }

  /**
   * Force a single element to exit the viewport
   * @param {DomElement} el - a DOM Selector string
   * @param {IntersectionObserverEntry} [state] Additional state to be passed as the IntersectionObserverEntry
   */
  static exit(el, state) {
    return MockIntersectionObserver.forceElement(find(el), {
      isIntersecting: false,
      intersectionRatio: 0,
      ...state,
    });
  }

  /**
   * Force an IntersectionObserverEntry targeted at a specific DOM node.
   * Useful when only triggering viewport state on certain elements.
   *
   * @param {DomElement} el
   * @param {object} [state] Additional state to be passed as the IntersectionObserverEntry
   */
  static forceElement(el, state) {
    MockIntersectionObserver.instances.forEach((instance) => {
      if (instance._watchedElements.includes(el)) {
        instance.callback([
          {
            target: el,
            ...state,
          },
        ]);
      }
    });
    return settled();
  }
}

/**
 * Replaces the global IntersectionObserver with the MockIntersectionObserver class
 *
 * @param {Sinon} sinon Pass sinon as the argument to ensure the mock is undone at the end of the test
 */
export default function mockDidIntersect(sinon) {
  sinon.replace(MockIntersectionObserver, 'instances', []);
  sinon.replace(window, 'IntersectionObserver', MockIntersectionObserver);
  return MockIntersectionObserver;
}
