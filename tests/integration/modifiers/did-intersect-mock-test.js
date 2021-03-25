import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import { setupDidIntersectModifier } from 'ember-scroll-modifiers/test-support/did-intersect-mock';

module(
  'Integration | Modifier | addon-test-support/did-intersect-mock',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.didIntersectMock = setupDidIntersectModifier(this);
      this.enterStub = sinon.stub();
      this.exitStub = sinon.stub();
      this.maxEnter = 1;
      this.maxExit = 1;
    });

    test('Did intersect mock triggers onEnter correctly', async function (assert) {
      assert.expect(2);

      await render(
        hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`
      );
      await this.didIntersectMock.enter();

      assert.ok(this.enterStub.calledOnce);
      assert.notOk(this.exitStub.calledOnce);
    });

    test('Did intersect mock triggers onExit correctly', async function (assert) {
      assert.expect(2);

      await render(
        hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`
      );
      await this.didIntersectMock.exit();

      assert.notOk(this.enterStub.calledOnce);
      assert.ok(this.exitStub.calledOnce);
    });

    test('Did intersect mock triggers onExit never exceeds maxEnter if maxEnter is provided', async function (assert) {
      assert.expect(1);

      await render(
        hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub maxEnter=this.maxEnter}}></div>`
      );

      for (let i = 0; i < this.maxEnter + 1; i++) {
        await this.didIntersectMock.enter();
      }

      assert.equal(this.enterStub.callCount, this.maxEnter);
    });

    test('Did intersect mock triggers onExit never exceeds maxExit if maxExit is provided', async function (assert) {
      assert.expect(1);

      await render(
        hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub maxExit=this.maxExit}}></div>`
      );

      for (let i = 0; i < this.maxExit + 1; i++) {
        await this.didIntersectMock.exit();
      }

      assert.equal(this.exitStub.callCount, this.maxExit);
    });

    test('Did intersect mock fire without limit if maxEnter and maxExit is not provided', async function (assert) {
      assert.expect(2);

      await render(
        hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`
      );

      const numOfFiredCallback = this.maxEnter + this.maxExit;

      for (let i = 0; i < numOfFiredCallback; i++) {
        this.didIntersectMock.enter();
        this.didIntersectMock.exit();
      }

      assert.equal(
        this.enterStub.callCount,
        numOfFiredCallback,
        'Enter callback has fired more than maxEnter times'
      );
      assert.equal(
        this.exitStub.callCount,
        numOfFiredCallback,
        'Exit callback has fired more than maxExit times'
      );
    });
  }
);
