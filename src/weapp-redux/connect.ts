import shallowEqual from "./shallowEqual"
import wrapActionCreators from "./wrapActionCreators"
import { Store, Unsubscribe, Config, MapStateToData, MapDispatchToActions } from "./types"

const defaultMapStateToData: MapStateToData = () => ({})
const defaultMapDispatchToActions: MapDispatchToActions = () => ({})

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

export default function connect(
  mapStateToData = defaultMapStateToData,
  mapDispatchToActions: MapDispatchToActions | AnyObject = defaultMapDispatchToActions
) {
  const shouldSubscribe = Boolean(mapStateToData)

  if (typeof mapDispatchToActions === "object") {
    mapDispatchToActions = wrapActionCreators(mapDispatchToActions)
  }

  return function wrapWithConnect(config: Config, isComponent = false) {
    const store = getApp().store
    if (!store) {
      throw new Error("Store对象不存在!")
    }

    // hack，以此区分page和component，懒得传参数区分
    isComponent = isComponent || Boolean(config.methods)
    const origOnCreate = isComponent ? config.attached : config.onLoad
    const origOnDestroy = isComponent ? config.detached : config.onUnload
    const origOnShow = isComponent ? config.pageLifetimes && config.pageLifetimes.show : config.onShow
    const origOnHide = isComponent ? config.pageLifetimes && config.pageLifetimes.hide : config.onHide

    function handleChange(this: DataResponser, checkConflictData = false) {
      if (!this.$$weappReduxInner) {
        return
      }

      if (this.$$weappReduxInner.hidden) {
        this.$$weappReduxInner.pendingUpdate = true
        return
      }

      const mappedState = mapStateToData(this.$$weappReduxInner.store.getState(), this.$$weappReduxInner.mapStateParams)

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

    const hooks = isComponent
      ? { attached: onCreate, detached: onDestroy, pageLifetimes: { show: onShow, hide: onHide } }
      : { onLoad: onCreate, onUnload: onDestroy, onShow, onHide }

    return { ...config, actions: (mapDispatchToActions as MapDispatchToActions)(getApp().store.dispatch), ...hooks }
  }
}
