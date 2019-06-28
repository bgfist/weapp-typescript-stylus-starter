import shallowEqual from "./shallowEqual"
import wrapActionCreators from "./wrapActionCreators"

const defaultMapStateToProps = (...args: any[]) => ({}) // eslint-disable-line no-unused-vars
const defaultMapDispatchToProps = (...args: any[]) => ({})

type Mapper = (...args: any[]) => { [k: string]: any }

interface DataResponser {
  data: any
  setData: (data: any) => void
}

export default function connect(mapStateToData?: Mapper, mapDispatchToActions?: Mapper | AnyObject) {
  const shouldSubscribe = Boolean(mapStateToData)
  const mapState = mapStateToData || defaultMapStateToProps
  const app = getApp()

  let mapDispatch: Mapper
  if (typeof mapDispatchToActions === "function") {
    mapDispatch = mapDispatchToActions as Mapper
  } else if (!mapDispatchToActions) {
    mapDispatch = defaultMapDispatchToProps
  } else {
    mapDispatch = wrapActionCreators(mapDispatchToActions)
  }

  return function wrapWithConnect(config: any) {
    // hack，以此区分page和component
    const origOnCreate = config.methods ? config.attached : config.onLoad
    const origOnDestroy = config.methods ? config.detached : config.onUnload

    const store = app.store
    if (!store) {
      throw new Error("Store对象不存在!")
    }
    let unsubscribe: AnyFunction

    function handleChange(this: DataResponser, options: any) {
      if (!unsubscribe) {
        return
      }

      const mappedState = mapState(store.getState(), options)
      if (!this.data || shallowEqual(this.data, mappedState)) {
        return
      }

      // todo: 监听页面显示和隐藏，隐藏时不调用
      this.setData(mappedState)
    }

    function onCreate(this: DataResponser, options: any) {
      if (shouldSubscribe) {
        unsubscribe = store.subscribe(handleChange.bind(this, options))
        handleChange.call(this, options)
      }
      if (typeof origOnCreate === "function") {
        origOnCreate.call(this, options)
      }
    }

    function onDestroy(this: DataResponser) {
      if (typeof origOnDestroy === "function") {
        origOnDestroy.call(this)
      }

      if (unsubscribe) {
        unsubscribe()
      }
    }

    const hooks = config.methods ? { attached: onCreate, detached: onDestroy } : { onLoad: onCreate, onUnload: onDestroy }

    function checkAndMergeData() {
      const storeData = mapState(store.getState(), {})
      const innerData = config.data
      for (const k in storeData) {
        if (innerData[k]) {
          throw new Error("redux提供的数据字段和组件内部提供的数据字段重复了")
        }
      }
      return { ...innerData, ...storeData }
    }

    return { ...config, actions: mapDispatch(app.store.dispatch), ...hooks, data: checkAndMergeData() }
  }
}
