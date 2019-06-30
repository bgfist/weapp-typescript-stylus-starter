import store from "./store/index"
import { Provider } from "./weapp-redux/index"
import { debug } from "./utils/log"

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
