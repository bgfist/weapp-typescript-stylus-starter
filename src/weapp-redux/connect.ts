import shallowEqual from "./shallowEqual"
import wrapActionCreators from "./wrapActionCreators"
import { Store, Unsubscribe } from "redux"

const defaultMapStateToProps = (...args: any[]) => ({}) // eslint-disable-line no-unused-vars
const defaultMapDispatchToProps = (...args: any[]) => ({})

type Mapper = (...args: any[]) => { [k: string]: any }

interface DataResponser {
  data: any
  setData: (data: any) => void
  $$weappReduxInner?: {
    store: Store
    unsubscribe: Unsubscribe
    mapStateParams: any
    hidden: boolean
    pendingUpdate: boolean
  }
}

export default function connect(mapStateToData?: Mapper, mapDispatchToActions?: Mapper | AnyObject) {
  const shouldSubscribe = Boolean(mapStateToData)
  const mapState = mapStateToData || defaultMapStateToProps

  let mapDispatch: Mapper
  if (typeof mapDispatchToActions === "function") {
    mapDispatch = mapDispatchToActions as Mapper
  } else if (!mapDispatchToActions) {
    mapDispatch = defaultMapDispatchToProps
  } else {
    mapDispatch = wrapActionCreators(mapDispatchToActions)
  }

  return function wrapWithConnect(config: any) {
    // hack，以此区分page和component，懒得传参数区分
    const origOnCreate = config.methods ? config.attached : config.onLoad
    const origOnDestroy = config.methods ? config.detached : config.onUnload
    const origOnShow = config.methods ? config.pageLifetimes && config.pageLifetimes.show : config.onShow
    const origOnHide = config.methods ? config.pageLifetimes && config.pageLifetimes.hide : config.onHide

    function handleChange(this: DataResponser, checkConflictData = false) {
      if (!this.$$weappReduxInner) {
        return
      }

      if (this.$$weappReduxInner.hidden) {
        this.$$weappReduxInner.pendingUpdate = true
        return
      }

      const mappedState = mapState(this.$$weappReduxInner.store.getState(), this.$$weappReduxInner.mapStateParams)

      if (checkConflictData) {
        for (const key in mappedState) {
          if (Object.prototype.hasOwnProperty.call(this.data, key)) {
            throw new Error(`redux提供的数据和组件内部提供的数据重复了，重复字段为: ${key}`)
          }
        }
      }

      if (!this.data || shallowEqual(mappedState, this.data)) {
        return
      }

      this.setData(mappedState)
    }

    function onCreate(this: DataResponser, options: any) {
      if (typeof origOnCreate === "function") {
        origOnCreate.call(this, options)
      }

      if (shouldSubscribe) {
        const store = getApp().store
        if (!store) {
          throw new Error("Store对象不存在!")
        }

        this.$$weappReduxInner = {
          store,
          unsubscribe: store.subscribe(handleChange.bind(this)),
          mapStateParams: options,
          pendingUpdate: false,
          hidden: false
        }
        handleChange.call(this, true)
      }
    }

    function onDestroy(this: DataResponser) {
      if (typeof origOnDestroy === "function") {
        origOnDestroy.call(this)
      }

      if (this.$$weappReduxInner) {
        this.$$weappReduxInner.unsubscribe()
      }
    }

    function onShow(this: DataResponser) {
      if (typeof origOnShow === "function") {
        origOnShow.call(this)
      }

      if (this.$$weappReduxInner) {
        this.$$weappReduxInner.hidden = false
        if (this.$$weappReduxInner.pendingUpdate) {
          handleChange.call(this)
          this.$$weappReduxInner.pendingUpdate = false
        }
      }
    }

    function onHide(this: DataResponser) {
      if (typeof origOnHide === "function") {
        origOnHide.call(this)
      }

      if (this.$$weappReduxInner) {
        this.$$weappReduxInner.hidden = true
      }
    }

    const hooks = config.methods
      ? { attached: onCreate, detached: onDestroy, pageLifetimes: { show: onShow, hide: onHide } }
      : { onLoad: onCreate, onUnload: onDestroy, onShow, onHide }

    return { ...config, actions: mapDispatch(getApp().store.dispatch), ...hooks }
  }
}
