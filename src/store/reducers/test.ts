import { createReducer } from "../utils"
import { addTest, doubleTest } from "../actions/index"
import { TestState } from "../state"

const initialState: TestState = {
  num: 0
}

const { reducer, addHandler } = createReducer(initialState)

export default reducer

addHandler(addTest, (num = 1, state) => {
  return {
    num: state.num + num
  }
})

addHandler(doubleTest, (_, state) => {
  return {
    num: state.num * 2
  }
})
