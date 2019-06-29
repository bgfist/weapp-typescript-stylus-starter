import { createStore } from "redux"
import reducer from "./reducers/index"

export default createStore(reducer)

export * from "./state/index"

export * from "./actions/index"
