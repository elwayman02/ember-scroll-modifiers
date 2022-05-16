import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class EsButtonComponent extends Component {
  @tracked shouldScroll;
  @tracked offset = 25;

  @action
  onScrollToElementWithOffset() {
    this.shouldScroll = true;
  }

  @action
  onOffsetChange(event) {
    // clear the shouldScroll value to prevent scrolling on offset change
    this.shouldScroll = false;
    this.offset = event.target.value;
  }
}
