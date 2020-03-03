import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Modifier | did-intersect', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.handler = sinon.stub();
  });

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    await render(hbs`<div {{did-intersect this.handler}}></div>`);

    assert.ok(true);
  });
});
