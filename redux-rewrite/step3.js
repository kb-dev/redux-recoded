class Store {
  constructor(reducers) {
    this._reducers = reducers;
    this._state = {};

    // Don't forget that because dispatch() can lose its context
    this.dispatch = this.dispatch.bind(this);

    this.dispatch({type: '__INIT__'});

    // New code
    this.subscribers = [];
  }

  dispatch(action) {
    const reducersNames = Object.keys(this._reducers);

    const nextState = reducersNames.reduce((newState, name) => {
      newState[name] = this._reducers[name](this._state[name], action);

      return newState;
    }, {});

    this._state = nextState;

    // New code : call each observer with the new state
    this.subscribers.forEach((subscriber) => {
      subscriber(this._state);
    });
  }

  // New code
  subscribe(subscriber) {
    this.subscribers.push(subscriber);

    // Return the unsubscribe function
		return () => {
			this.subscribers.splice(this.subscribers.indexOf(subscriber), 1);
		};
  }
}
