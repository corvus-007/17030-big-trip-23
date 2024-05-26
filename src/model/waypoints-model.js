import Observable from '../framework/observable';
import { getRandomWaypoint } from '../mock/waypoints';

const WAYPOINTS_COUNT = 4;

export default class WaypointsModel extends Observable {
  #waypoints = Array.from({ length: WAYPOINTS_COUNT }, getRandomWaypoint);

  get waypoints() {
    return this.#waypoints;
  }
}
