import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EsButtonComponent extends Component {
  @tracked shouldScrollWithOffset;
  @tracked shouldScrollWithCustom;
  @tracked shouldScroll;
  @tracked shouldScrollWithFocus;
  @tracked shouldScrollWithFocusElement;
  @tracked shouldFocusAfterScroll;
  @tracked shouldFocusAfterScrollWithFocusElement;
  @tracked topOffset = 25;
  @tracked leftOffset = 25;
  @tracked topOffsetCustom = 50;

  @action
  onScrollIntoView() {
    this.shouldScroll = true;
  }

  @action
  onScrollIntoViewWithFocus() {
    this.shouldScrollWithFocus = true;
    this.shouldFocusAfterScroll = true;
  }

  @action
  onScrollIntoViewWithFocusElement() {
    this.shouldScrollWithFocusElement = true;
    this.shouldFocusAfterScrollWithFocusElement = true;
  }

  @action
  onScrollIntoViewWithOffset() {
    this.shouldScrollWithOffset = true;
  }

  @action
  onScrollIntoViewWithCustom() {
    this.shouldScrollWithCustom = true;
  }

  @action
  onTopOffsetChange(event) {
    // clear the shouldScroll value to prevent scrolling on offset change
    this.shouldScrollWithOffset = false;
    this.topOffset = event.target.value;
  }

  @action
  onLeftOffsetChange(event) {
    // clear the shouldScroll value to prevent scrolling on offset change
    this.shouldScrollWithOffset = false;
    this.leftOffset = event.target.value;
  }

  @action
  onTopOffsetChangeCustom(event) {
    // clear the shouldScroll value to prevent scrolling on offset change
    this.shouldScrollWithCustom = false;
    this.topOffsetCustom = event.target.value;
  }
}
