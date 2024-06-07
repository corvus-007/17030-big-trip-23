import WaypointView from '../view/waypoint-view';
import WaypointEditView from '../view/waypoint-edit-view';
import { remove, render, replace } from '../framework/render';
import { UpdateType, UserAction } from '../const';
import { isDatesEqual } from '../utils/waypoint';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class WaypointPresenter {
  #waypointsContainerEl = null;
  #destinations = [];
  #offers = [];
  #waypoint = null;
  #waypointComponent = null;
  #waypointEditComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ waypointsContainerEl, destinations, offers, onDataChange, onModeChange }) {
    this.#waypointsContainerEl = waypointsContainerEl;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(waypoint) {
    this.#waypoint = waypoint;

    const prevWaypointComponent = this.#waypointComponent;
    const prevWaypointEditComponent = this.#waypointEditComponent;

    this.#waypointComponent = new WaypointView({
      waypoint: waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onBtnUnfoldClick: this.#handleBtnUnfoldClick,
      onBtnAddToFavoriteClick: this.#handleFavoriteClick,
    });
    this.#waypointEditComponent = new WaypointEditView({
      waypoint: waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onBtnFoldClick: this.#handleBtnFoldClick,
      onSubmit: this.#handleFormSubmit,
      onRemove: this.#handleWaypointRemove,
    });

    if (prevWaypointComponent === null || prevWaypointEditComponent === null) {
      render(this.#waypointComponent, this.#waypointsContainerEl);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#waypointEditComponent, prevWaypointEditComponent);
    }

    remove(prevWaypointComponent);
    remove(prevWaypointEditComponent);
  }

  destroy() {
    remove(this.#waypointComponent);
    remove(this.#waypointEditComponent);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#waypointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#waypointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#waypointEditComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#waypointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#waypointEditComponent.shake(resetFormState);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#waypointEditComponent.reset(this.#waypoint);
      this.#replaceEditedWaypointToWaypoint();
    }
  }

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#waypointEditComponent.reset(this.#waypoint);
      this.#replaceEditedWaypointToWaypoint();
    }
  };

  #handleBtnUnfoldClick = () => {
    this.#replaceWaypointToEditedWaypoint();
  };

  #handleBtnFoldClick = () => {
    this.#waypointEditComponent.reset(this.#waypoint);
    this.#replaceEditedWaypointToWaypoint();
  };

  #handleFormSubmit = (waypoint) => {
    const isDatesFromEqual = isDatesEqual(this.#waypoint.dateFrom, waypoint.dateFrom);
    const isDatesToEqual = isDatesEqual(this.#waypoint.dateTo, waypoint.dateTo);
    const isPatchUpdate = isDatesFromEqual && isDatesToEqual;

    this.#handleDataChange(
      UserAction.UPDATE_WAYPOINT,
      isPatchUpdate ? UpdateType.PATCH : UpdateType.MINOR,
      waypoint,
    );
  };

  #handleWaypointRemove = (waypoint) => {
    this.#handleDataChange(
      UserAction.REMOVE_WAYPOINT,
      UpdateType.MINOR,
      waypoint,
    );
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_WAYPOINT,
      UpdateType.MINOR,
      { ...this.#waypoint, isFavorite: !this.#waypoint.isFavorite },
    );
  };

  #replaceWaypointToEditedWaypoint = () => {
    replace(this.#waypointEditComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#escKeydownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceEditedWaypointToWaypoint = () => {
    replace(this.#waypointComponent, this.#waypointEditComponent);
    document.removeEventListener('keydown', this.#escKeydownHandler);
    this.#mode = Mode.DEFAULT;
  };
}
