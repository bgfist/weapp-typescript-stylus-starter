export interface Action<P> {
  type: string
  payload: P
}

type ActionCreator<P> = (payload: P) => Action<P>

type Handler<P, S> = (payload: P, state: S) => S

export function createActionCreator<P>(type: string): ActionCreator<P> {
  const actionCreator = (payload: P) => ({ type, payload })
  actionCreator.toString = () => type

  return actionCreator
}

export function createReducer<S>(initialState: S) {
  const handlers: { [type: string]: Handler<any, S> } = {}

  const reducer = (state: S | undefined, action: Action<any>) => {
    if (!state) {
      return initialState
    }

    const { type, payload } = action
    const handler = handlers[type]
    if (!handler) {
      return initialState
    }

    return handler(payload, state)
  }

  const addHandler = <P>(actionCreator: ActionCreator<P>, handler: Handler<P, S>) => {
    handlers[actionCreator.toString()] = handler
  }

  return {
    reducer,
    addHandler
  }
}
