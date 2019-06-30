import { ActionCreator, Dispatch, ActionCreators } from "./types"

export function bindActionCreator<T extends ActionCreator>(actionCreator: T, dispatch: Dispatch) {
  return function creator(...args: any[]) {
    return dispatch(actionCreator.apply(undefined, args) as ReturnType<T>)
  }
}

export function bindActionCreators(actionCreators: ActionCreators, dispatch: Dispatch) {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators !== "object" || actionCreators === null) {
    throw new Error(
      "bindActionCreators expected an object or a function, instead received " +
        (actionCreators === null ? "null" : typeof actionCreators) +
        ". " +
        'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?'
    )
  }

  const keys = Object.keys(actionCreators)
  const boundActionCreators: ActionCreators = {}
  for (const key of keys) {
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}

export default function wrapActionCreators(actionCreators: ActionCreators) {
  return (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch)
}
