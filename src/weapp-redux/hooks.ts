import { useMemo, useEffect, useRef, useReducer } from "../hooks"
import { State, Store, ActionCreator } from "./types"
import { bindActionCreator } from "./wrapActionCreators"

const strictEqual = (a: any, b: any) => a === b

type Selector<T> = (state: State) => T

export function useStore() {
  const store: Store = getApp().store

  if (!store) {
    throw new Error("store对象不存在")
  }

  return store
}

export function useDispatch() {
  const store = useStore()
  return store.dispatch
}

export function useActionCreator<T extends ActionCreator>(actionCreator: T): (...params: Parameters<T>) => ReturnType<T> {
  return useMemo(() => bindActionCreator(actionCreator, useDispatch()), [actionCreator])
}

export function useSelector<T>(selector: Selector<T>) {
  const store = useStore()

  const [, forceRender] = useReducer(s => s + 1, 0)

  const latestSubscriptionCallbackError = useRef<Error>()
  const latestSelector = useRef<Selector<T>>()
  const latestSelectedState = useRef<T>()

  let selectedState: T

  try {
    if (selector !== latestSelector.current || latestSubscriptionCallbackError.current) {
      selectedState = selector(store.getState())
    } else {
      selectedState = latestSelectedState.current!
    }
  } catch (err) {
    let errorMessage = `An error occured while selecting the store state: ${err.message}.`

    if (latestSubscriptionCallbackError.current) {
      errorMessage += `\nThe error may be correlated with this previous error:\n${latestSubscriptionCallbackError.current.stack}\n\nOriginal stack trace:`
    }

    throw new Error(errorMessage)
  }

  useEffect(() => {
    latestSelector.current = selector
    latestSelectedState.current = selectedState
    latestSubscriptionCallbackError.current = undefined
  })

  useEffect(() => {
    function checkForUpdates() {
      try {
        const newSelectedState = latestSelector.current!(store.getState())

        if (strictEqual(newSelectedState, latestSelectedState.current)) {
          return
        }

        latestSelectedState.current = newSelectedState
      } catch (err) {
        // we ignore all errors here, since when the component
        // is re-rendered, the selectors are called again, and
        // will throw again, if neither props nor store state
        // changed
        latestSubscriptionCallbackError.current = err
      }

      forceRender({})
    }

    return store.subscribe(checkForUpdates)
  }, [])

  return selectedState
}
