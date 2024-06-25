import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module(
  'Integration | Modifier | did-intersect without mocks',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.enterStub = sinon.stub();
      this.exitStub = sinon.stub();
      this.maxEnter = 1;
      this.maxExit = 1;

      this.observerManagerService = this.owner.lookup(
        'service:ember-scroll-modifiers@observer-manager',
      );
    });

    test('it removes elements from the registry on modifier cleanup', async function (assert) {
      let removedElementsCount = 0;
      let originalRemoveElement = this.observerManagerService.removeElement;
      const observerManagerService = this.observerManagerService;

      observerManagerService.removeElement = function removeElementExt(
        ...args
      ) {
        removedElementsCount++;
        originalRemoveElement.call(observerManagerService, ...args);
      };
      for (let index = 0; index < 50; index++) {
        await render(
          hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}>
          <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
        </div>`,
        );
      }

      assert.strictEqual(
        removedElementsCount,
        49 * 2, // once for the element, once for a window object
      );
    });
  },
);
