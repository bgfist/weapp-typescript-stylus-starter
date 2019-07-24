import "./core/polyfills"
import * as Weact from "@bgfist/weact"
import store from "./store/index"
import { Provider } from "@bgfist/weact-redux"
import { debug } from "./utils/log"

Weact.debugWeact(true)

const debugRedux = debug("redux")

store.subscribe(() => {
  debugRedux(store.getState())
})

interface App {
  globalInfo: number
}

const makeContext = Provider(store)

App(
  makeContext<any, App>({
    globalInfo: 1,
    onError(error) {
      console.error(`App Error: ${error}, globalInfo: ${this.globalInfo}`)
    }
  })
)
