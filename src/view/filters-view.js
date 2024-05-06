import AbstractView from '../framework/view/abstract-view';
import { capitaliseFirstLetter } from '../utils';

const FILTERS = [
  'everything',
  'future',
  'present',
  'past',
];

const createFilterItemTemplate = (filter) => (
  `<div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}">
      <label class="trip-filters__filter-label" for="filter-everything">${capitaliseFirstLetter(filter)}</label>
  </div>`
);

const createFiltersTemplate = () => (
  `<form class="trip-filters" action="#" method="get">
      ${FILTERS.map(createFilterItemTemplate).join('')}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
);

export default class FiltersView extends AbstractView {
  get template() {
    return createFiltersTemplate();
  }
}
