import Store from './store';

type Union<T> = T[keyof T];
export type ActionEntry<Key, T> = { readonly [P in keyof T]: T[P] } & { type: Key };
export type ActionKey = string;
export type Actions<T> = { readonly [P in keyof T]: ActionEntry<P, T[P]> };
export type AnyAction<T> = Union<T>;
export type Dispatch<T> = (action: Union<T> | ObjectAction) => void;
export type FirstArgument<T> = T extends (a: infer U, b, c) => infer U ? U : any;
export type ObjectAction = { type: ActionKey; data?: any };
export type Reducer<T> = (previousState: State<T>, action: ObjectAction) => State<T>;
export type StateOfReducer<T extends (...args) => any> = ReturnType<T>;
export type State<T> = { readonly [P in keyof T]: FirstArgument<T[P]> };

export default class Zebulon {
	public static createActions<T>(actions: T): Actions<T> {
		return Object.keys(actions).reduce(
			(acc, e) => {
				acc[e] = actions[e];

				return acc;
			},
			{} as Actions<T>, // tslint:disable-line
		);
	}

	public static createReducer<T>(reducers: T): Reducer<T> {
		return (previousState, action) =>
			Object.keys(reducers).reduce(
				(acc, key) => {
					acc[key] = reducers[key](previousState[key], action);

					return acc;
				},
				{} as State<T>, // tslint:disable-line
			);
	}

	public static createStore<T>(mainReducer: Reducer<T>): Store<T> {
		return new Store<T>(mainReducer);
	}
}
