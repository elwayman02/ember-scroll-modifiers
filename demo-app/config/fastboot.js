/*
 * Fastboot runs in a "sandbox" that is by default unaware of Node globals.
 * Globals used in the demo-app built with field-guide (typically fetch) must
 * be passed to the sandbox explicitly. Aside from fetch, the content of this
 * file is rather generic to Ember and EmberData.
 */
module.exports = function () {
  return {
    buildSandboxGlobals(defaultGlobals) {
      return Object.assign({}, defaultGlobals, {
        atob: atob,
        fetch: fetch,
        AbortController,
        ReadableStream:
          typeof ReadableStream !== 'undefined'
            ? ReadableStream
            : require('node:stream/web').ReadableStream,
        WritableStream:
          typeof WritableStream !== 'undefined'
            ? WritableStream
            : require('node:stream/web').WritableStream,
        TransformStream:
          typeof TransformStream !== 'undefined'
            ? TransformStream
            : require('node:stream/web').TransformStream,
        Headers: typeof Headers !== 'undefined' ? Headers : undefined,
      });
    },
  };
};
