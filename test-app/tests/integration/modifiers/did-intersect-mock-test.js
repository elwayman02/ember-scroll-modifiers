import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import mockDidIntersect from 'ember-scroll-modifiers/test-support/did-intersect-mock';

module(
  'Integration | Modifier | addon-test-support/did-intersect-mock',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.didIntersectMock = mockDidIntersect(sinon);
      this.enterStub = sinon.stub();
      this.exitStub = sinon.stub();
      this.maxEnter = 1;
      this.maxExit = 1;
    });

    test('Did intersect mock triggers onEnter correctly', async function (assert) {
      await render(
        hbs`<div data-test-did-intersect {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`,
      );
      await this.didIntersectMock.enter('[data-test-did-intersect]');

      assert.ok(this.enterStub.calledOnce);
      assert.notOk(this.exitStub.calledOnce);
    });

    test('Did intersect mock triggers onEnter with additional state correctly', async function (assert) {
      await render(
        hbs`<div data-test-did-intersect {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`,
      );
      await this.didIntersectMock.enter('[data-test-did-intersect]', {
        time: 100,
      });

      assert.ok(
        this.enterStub.calledWithMatch({
          time: 100,
        }),
      );
    });

    test('Did intersect mock triggers onExit correctly', async function (assert) {
      await render(
        hbs`<div data-test-did-intersect {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`,
      );
      await this.didIntersectMock.exit('[data-test-did-intersect]');

      assert.notOk(this.enterStub.calledOnce);
      assert.ok(this.exitStub.calledOnce);
    });

    test('Did intersect mock triggers onExit with additional state correctly', async function (assert) {
      await render(
        hbs`<div data-test-did-intersect {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`,
      );
      await this.didIntersectMock.exit('[data-test-did-intersect]', {
        time: 100,
      });

      assert.ok(
        this.exitStub.calledWithMatch({
          time: 100,
        }),
      );
    });

    test('Did intersect mock triggers onExit never exceeds maxEnter if maxEnter is provided', async function (assert) {
      await render(
        hbs`<div data-test-did-intersect {{did-intersect onEnter=this.enterStub onExit=this.exitStub maxEnter=this.maxEnter}}></div>`,
      );

      for (let i = 0; i < this.maxEnter + 1; i++) {
        await this.didIntersectMock.enter('[data-test-did-intersect]');
      }

      assert.strictEqual(this.enterStub.callCount, this.maxEnter);
    });

    test('Did intersect mock triggers onExit never exceeds maxExit if maxExit is provided', async function (assert) {
      await render(
        hbs`<div data-test-did-intersect {{did-intersect onEnter=this.enterStub onExit=this.exitStub maxExit=this.maxExit}}></div>`,
      );

      for (let i = 0; i < this.maxExit + 1; i++) {
        await this.didIntersectMock.exit('[data-test-did-intersect]');
      }

      assert.strictEqual(this.exitStub.callCount, this.maxExit);
    });

    test('Did intersect mock fire without limit if maxEnter and maxExit is not provided', async function (assert) {
      await render(
        hbs`<div data-test-did-intersect {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}></div>`,
      );

      const numOfFiredCallback = this.maxEnter + this.maxExit;

      for (let i = 0; i < numOfFiredCallback; i++) {
        this.didIntersectMock.enter('[data-test-did-intersect]');
        this.didIntersectMock.exit('[data-test-did-intersect]');
      }

      assert.strictEqual(
        this.enterStub.callCount,
        numOfFiredCallback,
        'Enter callback has fired more than maxEnter times',
      );
      assert.strictEqual(
        this.exitStub.callCount,
        numOfFiredCallback,
        'Exit callback has fired more than maxExit times',
      );
    });
  },
);
