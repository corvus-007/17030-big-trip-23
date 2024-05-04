import { createElement } from '../render';
import { capitaliseFirstLetter } from '../utils';

const SORTING_LIST = [
  'day',
  'event',
  'time',
  'price',
  'offer',
];

const createSortingItemTemplate = (item) => (`
  <div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-${item}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item}">
    <label class="trip-sort__btn" for="sort-${item}">${capitaliseFirstLetter(item)}</label>
  </div>`
);

const createSortingTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${SORTING_LIST.map(createSortingItemTemplate).join('')}
    </form>`
);

export default class SortingView {
  getTemplate() {
    return createSortingTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
