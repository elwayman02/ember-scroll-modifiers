import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @tracked
  numIntersections = 0;

  @tracked
  numIntersectionsWithMaxEnter = 0;

  maxIntersections = 5;

  @action
  onEnteringIntersection() {
    this.numIntersections++;
  }

  @action
  onEnteringIntersectionWithMaxEnter() {
    this.numIntersectionsWithMaxEnter++;
  }
}
