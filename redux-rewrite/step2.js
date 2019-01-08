class Store {
  constructor(reducers) {
    this._reducers = reducers;
    this._state = {};

    // Don't forget that because dispatch() can lose its context
    this.dispatch = this.dispatch.bind(this);

    // We also add a init call to create the default state of Store
    this.dispatch({type: '__INIT__'});
  }

  dispatch(action) {
    // Get all reducers names
    const reducersNames = Object.keys(this._reducers);

    // Compute the new current state of the application
    //  by propagating the action
    const nextState = reducersNames.reduce((newState, name) => {
      // Just call each reducer with the current state of the reducer
      //  and the action
      newState[name] = this._reducers[name](this._state[name], action);

      return newState;
    }, {});

    // Keep the new state in memory
    this._state = nextState;
  }

  getState() {
    return this._state;
  }
}
