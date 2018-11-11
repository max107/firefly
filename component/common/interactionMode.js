const TAB_KEY_CODE = 9;

/* istanbul ignore next */
/**
 * A nifty little class that maintains event handlers to add a class to the container element
 * when entering "mouse mode" (on a `mousedown` event) and remove it when entering "keyboard mode"
 * (on a `tab` key `keydown` event).
 */
export class InteractionModeEngine {
  handleKeyDown = (e) => {
    if (e.which === TAB_KEY_CODE) {
      this.reset();
      this.container.addEventListener('mousedown', this.handleMouseDown);
    }
  };
  handleMouseDown = () => {
    this.reset();
    this.container.classList.add(this.className);
    this.container.addEventListener('keydown', this.handleKeyDown);
  };

  // tslint:disable-next-line:no-constructor-vars
  constructor(container, className) {
    this.container = container;
    this.className = className;
    this.isRunning = false;
  }

  /** Returns whether the engine is currently running. */
  isActive() {
    return this.isRunning;
  }

  /** Enable behavior which applies the given className when in mouse mode. */
  start() {
    this.container.addEventListener('mousedown', this.handleMouseDown);
    this.isRunning = true;
  }

  /** Disable interaction mode behavior and remove className from container. */
  stop() {
    this.reset();
    this.isRunning = false;
  }

  reset() {
    this.container.classList.remove(this.className);
    this.container.removeEventListener('keydown', this.handleKeyDown);
    this.container.removeEventListener('mousedown', this.handleMouseDown);
  }
}
