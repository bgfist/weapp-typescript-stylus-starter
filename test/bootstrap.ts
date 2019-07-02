const endlessProxy: any = new Proxy(
  () => {
    //
  },
  {
    get() {
      return endlessProxy
    },
    apply() {
      return endlessProxy
    }
  }
)

// @ts-ignore
global.Page = endlessProxy
// @ts-ignore
global.Component = endlessProxy
// @ts-ignore
global.wx = endlessProxy

let app = {}
// @ts-ignore
global.App = options => (app = options)
// @ts-ignore
global.getApp = () => app
// @ts-ignore
global.getCurrentPages = () => []

jest.useFakeTimers()
