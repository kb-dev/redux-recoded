class Store {
  constructor(reducers) {
    this._reducers = reducers;
    this._state = {};
    this._history = {
      max: 10,
      nexts: [],
      previous: [],
    };

    this.dispatch = this.dispatch.bind(this);

    this.dispatch({type: '__INIT__'});
  }

  _dispatch(action) {
    if (this._history.previous.length > this._history.max) {
      this._history.shift();
    }

    this._history.previous.push(this._state);

    this._state = 
      Object.keys(this._reducers)
        .reduce((newState, name) => {
          newState[name] = this._reducers[name](
            this._state[name],
            action
          );

          return newState;
        }, {});
  }

  dispatch(action) {
    if (typeof action === 'function') {
      return action(this.dispatch);
    }

    return this._dispatch(action);
  }

  cancel() {
    if (this._history.previous.length) {
      this._history.nexts.unshift(this._state);

      this._state = this._history.previous.pop();
    }
  }

  next() {
    if (this._history.nexts.length) {
      this._history.previous.push(this._state);

      this._state = this._history.nexts.shift();
    }
  }

  getState() {
    return this._state;
  }
}

module.exports = Store;