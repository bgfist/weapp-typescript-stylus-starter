import { combineReducers } from "redux"
import test from "./test"

const rootReducer = combineReducers({
  test
})

export default rootReducer

export type AppState = ReturnType<typeof rootReducer>
