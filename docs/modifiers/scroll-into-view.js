import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class EsButtonComponent extends Component {
  @tracked shouldScrollWithOffset;
  @tracked shouldScroll;
  @tracked offset = 25;

  @action
  onScrollIntoView() {
    this.shouldScroll = true;
  }

  @action
  onScrollIntoViewWithOffset() {
    this.shouldScrollWithOffset = true;
  }

  @action
  onOffsetChange(event) {
    // clear the shouldScroll value to prevent scrolling on offset change
    this.shouldScrollWithOffset = false;
    this.offset = event.target.value;
  }
}
