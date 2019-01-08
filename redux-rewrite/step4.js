class Store {
  // Just renamed the old dispatch to _dispatch
  _dispatch(action) {
    const reducersNames = Object.keys(this._reducers);

    const nextState = reducersNames.reduce((newState, name) => {
      newState[name] = this._reducers[name](this._state[name], action);

      return newState;
    }, {});

    this._state = nextState;

    this.subscribers.forEach((subscriber) => {
      subscriber(this._state);
    });
  }

  // New code
  dispatch(action) {
    if (typeof action === 'function') {
      return action(this.dispatch);
    }

    this._dispatch(action);
  }
}
