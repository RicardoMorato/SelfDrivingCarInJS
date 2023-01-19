class Controls {
  constructor() {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;
    this._keyboardEvents = {
      ArrowLeft: (boolean) => (this.left = boolean),
      ArrowRight: (boolean) => (this.right = boolean),
      ArrowUp: (boolean) => (this.forward = boolean),
      ArrowDown: (boolean) => (this.reverse = boolean),
    };

    this.#addKeyboardListeners();
  }

  #addKeyboardListeners() {
    document.onkeydown = (event) => {
      if (Object.keys(this._keyboardEvents).includes(event.key))
        this._keyboardEvents[event.key](true);
    };

    document.onkeyup = (event) => {
      if (Object.keys(this._keyboardEvents).includes(event.key))
        this._keyboardEvents[event.key](false);
    };
  }
}
