/*
 * The name of this view
 * Later, to render this view, call:
 * New Controls(options).render(this.container)
 */

/**
 * Sets movement keys
 * @constant
 * @type {Set}
 * @param {String} up key up
 * @param {String} down key down
 * @param {String} left key left
 * @param {String} right key right
 * @memberof Controls
 * @public
 */
const movementKeys = new Set(['up', 'down', 'left', 'right']);

/**
 * Maps keys with the in-game function key equivelant  
 * @constant
 * @param {json} keys
 * @param {String} keys.KeyW "up"
 * @param {String} keys.KeyS "down"
 * @param {String} keys.KeyA "left"
 * @param {String} keys.KeyD "right"
 * @param {String} keys.ArrowUp "up"
 * @param {String} keys.ArrowDown "down"
 * @param {String} keys.ArrowLeft "left"
 * @param {String} keys.ArrowRight "right"
 * @param {String} keys.KeyK "up"
 * @param {String} keys.KeyJ "down"
 * @param {String} keys.KeyH "left"
 * @param {String} keys.KeyL "right"
 * @param {String} keys.Escape "escape"
 * @memberof Controls
 * @public
 */
const keyMapper = {
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyK: 'up',
  KeyJ: 'down',
  KeyH: 'left',
  KeyL: 'right',
  Escape: 'escape',
};

/**
 * Maps keys toggle  
 * @constant
 * @param {json} toggleKey
 * @param {String} toggleKey.Escape "escape"
 * @memberof Controls
 * @public
 */
const toggleKeys = {
  Escape: 'escape',
};

/**
 * Handle game control keys
 * @class Controls
 * @constructor
 * @param options
 * @extends Component
 * @public
 */
 class Controls extends Component {

  /**
   * @type {Set} pressedKeys
   * @memberof Controls
   * @public
   */
  #pressedKeys = new Set();

  // This callback is set in CanvasView
  afterKeyPress = undefined;

  constructor(options) {
    super({
      ...options,
      hasContainer: false,
    });
  }

  /**
   * Handle render-related functionality for controls
   * @async
   * @function render
   * @memberof Controls
   */
  async render() {
    await super.render();

    const handleKeyPress = this.handleKeyPress.bind(this);
    document.body.addEventListener('keydown', handleKeyPress);
    this.destructors.push(() =>
      document.body.removeEventListener('keydown', handleKeyPress)
    );
    document.body.addEventListener('keyup', handleKeyPress);
    this.destructors.push(() =>
      document.body.removeEventListener('keyup', handleKeyPress)
    );

    return this;
  }

  /**
   * @function handleKeyPress
   * @memberof Controls
   * @param {type, code}
   */
  handleKeyPress({ type, code }) {

    if (code in toggleKeys) {
      if (type === 'keyup') this.options.handleKeyToggle(toggleKeys[code]);
      return;
    }

    if (!(code in keyMapper)) return;

    this.#pressedKeys[type === 'keydown' ? 'add' : 'delete'](keyMapper[code]);

    if (DEVELOPMENT) console.log(Array.from(this.#pressedKeys));

    if (this.#pressedKeys.has('up') && this.#pressedKeys.has('down'))
      this.#pressedKeys.delete('down');
    if (this.#pressedKeys.has('left') && this.#pressedKeys.has('right'))
      this.#pressedKeys.delete('left');

    if (typeof this.afterKeyPress !== 'undefined') this.afterKeyPress();
  }

  /**
   * @function getPressedSpecialKeys
   * @memberof Controls
   */
  getPressedSpecialKeys() {
    return Array.from(this.#pressedKeys).filter(
      (key) => !movementKeys.has(key)
    );
  }

  /**
   * @function getMovementDirection
   * @memberof Controls
   */
  getMovementDirection() {
    const pressedKeys = new Set(
      Array.from(this.#pressedKeys).filter((key) => movementKeys.has(key))
    );

    const movementDirection = [0, 0];

    if (pressedKeys.has('up')) movementDirection[0] = -1;
    else if (pressedKeys.has('down')) movementDirection[0] = 1;

    if (pressedKeys.has('left')) movementDirection[1] = -1;
    else if (pressedKeys.has('right')) movementDirection[1] = 1;

    return movementDirection;
  }
}
