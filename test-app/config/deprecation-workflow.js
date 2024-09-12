/* eslint-disable no-undef */

/**
 * This config leverages https://github.com/mixonic/ember-cli-deprecation-workflow
 * This addon intercepts Ember deprecation warnings and provides an easy way to address the errors.
 */

window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  // If we uncomment the line below, any unhandled error i.e a new error introduced would fail the tests.
  throwOnUnhandled: true,
  workflow: [
    { handler: 'silence', matchId: 'ember-string.add-package' },
    { handler: 'silence', matchId: 'component-template-resolving' },
  ],
};
