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

App<App>(
  Provider(store)({
    globalInfo: 1,
    onError(error) {
      console.error(`App Error: ${error}, globalInfo: ${this.globalInfo}`)
    }
  })
)
