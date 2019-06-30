import { Store, AppConfig } from "./types"

export default function Provider(store: Store) {
  return <D, E>(config: App.AppInstance<D> & E): AppConfig<D, E> => {
    return { ...config, store }
  }
}
