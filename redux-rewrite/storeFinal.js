class Store {
  constructor(reducers) {
    this._reducers = reducers;
    this._state = {};
    this.subscribers = [];

    this.dispatch = this.dispatch.bind(this);

    this.dispatch({ type: "__INIT__" });
  }

  _dispatch(action) {
    const reducersNames = Object.keys(this._reducers);

    const nextState = reducersNames.reduce((newState, name) => {
      newState[name] = this._reducers[name](this._state[name], action);

      return newState;
    }, {});

    this._state = nextState;

    this.subscribers.forEach(subscriber => {
      subscriber(this._state);
    });
  }

  dispatch(action) {
    if (typeof action === "function") {
      return action(this.dispatch);
    }

    this._dispatch(action);
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);

    return () => {
      this.subscribers.splice(this.subscribers.indexOf(subscriber), 1);
    };
  }

  getState() {
    return this._state;
  }
}
