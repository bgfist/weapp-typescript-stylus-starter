import { Store, AnyAction } from "redux"

export default function Provider(store: Store<any, any>) {
  return <D>(appConfig: App.AppInstance<D> & D) => {
    return { ...appConfig, store }
  }
}
