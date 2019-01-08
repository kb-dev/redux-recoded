import { ObjectAction, Reducer, State } from './index';

type Dispatcher = (action: ObjectAction) => void;
type FunctionAction = (dispatch: Dispatcher) => void;
type DispatchAction = ObjectAction | FunctionAction;
type Listener<T> = (state: State<T>) => void;
type Middleware<T> = (store: Store<T>) => (next: Dispatcher) => Dispatcher;

const InternalActions = {
	INITIALIZATION: '__INITIALIZATION__',
	REPLACE: '__REPLACE__',
};

export default class Store<T> {
	private isPropagating: boolean;
	private listeners: Array<Listener<T>>;
	private middlewares: Array<Middleware<T>>;
	private queue: Array<DispatchAction>;
	private reducer: Reducer<T>;
	private state: State<T>;

	public constructor(mainReducer: Reducer<T>, preloadedState?: State<T>) {
		this.isPropagating = false;
		this.listeners = [];
		this.middlewares = [];
		this.queue = [];
		this.reducer = mainReducer;
		this.state = preloadedState || ({} as State<T>);

		this.state = mainReducer(this.state, { type: InternalActions.INITIALIZATION }); // tslint:disable-line

		this.dispatch = this.dispatch.bind(this);
		this._internalDispatch = this._internalDispatch.bind(this);
		this._propagate = this._propagate.bind(this);
		this._addToQueue = this._addToQueue.bind(this);
	}

	private _addToQueue(action: DispatchAction) {
		this.queue.push(action);
	}

	private _internalDispatch(action: DispatchAction) {
		this._addToQueue(action);

		if (!this.isPropagating) {
			this._executeQueue();
		}
	}

	private _executeQueue() {
		this.isPropagating = true;

		while (this.queue.length) {
			const action = this.queue.shift();

			if (action && 'type' in action) {
				this._propagate(action);
			}
		}

		this.isPropagating = false;
	}

	private _propagate(action: ObjectAction) {
		this.state = this.reducer(this.state, action);

		this.listeners.forEach((listener) => {
			listener(this.state);
		});
	}

	public addMiddleware(...middlewares: Array<Middleware<T>>) {
		this.middlewares.push(...middlewares);
	}

	public dispatch(action: DispatchAction) {
		if (!('type' in action) && typeof action === 'function') {
			return action(this.dispatch);
		} else if (!('type' in action)) {
			throw new Error(`action need a type. Action received : ${action}`);
		} else if (typeof action.type !== 'string') {
			throw new Error(`action.type must be a string. Type received : ${action.type}`);
		}

		if (this.middlewares.length) {
			return this.middlewares.reverse().reduce((accFn, middleware) => {
				return (act) => middleware(this)(accFn)(act);
			}, this._internalDispatch)(action);
		}
	}

	public getState(): State<T> {
		return this.state;
	}

	public replaceReducer(newReducer: Reducer<T>) {
		this.reducer = newReducer;

		this.dispatch({ type: InternalActions.REPLACE });
	}

	public subscribe(listener: Listener<T>) {
		this.listeners.push(listener);

		return () => {
			this.listeners.splice(this.listeners.indexOf(listener), 1);
		};
	}
}
