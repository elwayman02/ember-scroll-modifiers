/* eslint-disable no-undef */

/**
 * This config leverages https://github.com/mixonic/ember-cli-deprecation-workflow
 * This addon intercepts Ember deprecation warnings and provides an easy way to address the errors.
 */

window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  // If we uncomment the line below, any unhandled error i.e a new error introduced would fail the tests.
  // throwOnUnhandled: true,
  workflow: [
    // If we want tests to fail, we need to modify the handler to 'throw'
    {
      handler: 'silence',
      matchId: 'deprecated-run-loop-and-computed-dot-access',
    },
    {
      handler: 'silence',
      matchId: 'ember-glimmer.link-to.positional-arguments',
    },
    { handler: 'silence', matchId: 'ember-keyboard.first-responder-inputs' },
    { handler: 'silence', matchId: 'ember.built-in-components.import' },
    {
      handler: 'silence',
      matchId: 'ember.built-in-components.legacy-arguments',
    },
    { handler: 'silence', matchId: 'ember.built-in-components.reopen' },
    { handler: 'silence', matchId: 'manager-capabilities.modifiers-3-13' },
    { handler: 'silence', matchId: 'this-property-fallback' },
  ],
};
