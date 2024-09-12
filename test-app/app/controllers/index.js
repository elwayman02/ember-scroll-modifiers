import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @tracked
  numIntersections = 0;

  @tracked
  numIntersectionsWithMaxEnter = 0;

  maxIntersections = 5;

  @tracked
  isObserving = true;

  @tracked
  numIntersectionsWithIsObserving = 0;

  @tracked
  shouldScrollIntoView = false;

  @action
  onEnteringIntersection() {
    this.numIntersections++;
  }

  @action
  onEnteringIntersectionWithMaxEnter() {
    this.numIntersectionsWithMaxEnter++;
  }

  @action
  toggleIsObserving() {
    this.isObserving = !this.isObserving;
  }

  @action
  onEnteringWithIsObserving() {
    this.numIntersectionsWithIsObserving++;
  }

  @action
  onScrollIntoViewTrigger() {
    this.shouldScrollIntoView = true;
  }
}
