import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class EsButtonComponent extends Component {
  @tracked shouldScrollWithOffset;
  @tracked shouldScroll;
  @tracked topOffset = 25;
  @tracked leftOffset = 25;

  @action
  onScrollIntoView() {
    this.shouldScroll = true;
  }

  @action
  onScrollIntoViewWithOffset() {
    this.shouldScrollWithOffset = true;
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
}
