import HeaderView from '../view/header-view';
import { render, RenderPosition } from '../framework/render';
import FiltersView from '../view/filters-view';
import NewEventButtonView from '../view/new-event-button-view';

export default class HeaderPresenter {
  #headerComponent = null;
  #filterComponent = null;
  #newEventButtonComponent = null;

  #containerElement = null;

  constructor({ containerEl, filters, activeFilter }) {
    this.#headerComponent = new HeaderView();
    this.#filterComponent = new FiltersView({ filters, activeFilter });
    this.#newEventButtonComponent = new NewEventButtonView();

    this.#containerElement = containerEl;
  }

  init() {
    render(this.#headerComponent, this.#containerElement, RenderPosition.AFTERBEGIN);

    const tripMainEl = this.#headerComponent.element.querySelector('.trip-main');
    const filterContainerEl = tripMainEl.querySelector('.trip-controls__filters');

    render(this.#newEventButtonComponent, tripMainEl);
    render(this.#filterComponent, filterContainerEl);
  }
}
