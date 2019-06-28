import { collectClassProps, splitFieldsAndMethods, identity } from "./utils/lang"

interface WXComponent<P extends AnyObject = never, D extends AnyObject = never, A extends AnyObject = never> extends Component.WXComponent<P, D> {
  actions: A
}

class WXComponent<P extends AnyObject = never, D extends AnyObject = never, A extends AnyObject = never> {
  public init(connect = identity) {
    let props: WXComponent<P, D> = collectClassProps(this, "init")

    const {
      options,
      externalClasses,
      behaviors,
      properties,
      data,
      observers,
      lifetimes,
      pageLifetimes,
      export: $export,
      relations,
      created,
      attached,
      ready,
      moved,
      detached,
      error,
      ...others
    } = props

    props = checkMethodsProp(others)
    props = checkActionsProp(others)
    props = checkForbiddenProps(props)
    const transformedProperties = transformProperties(properties)
    const { fields, methods } = splitFieldsAndMethods(props)
    props = connect({
      options,
      externalClasses,
      behaviors,
      properties: transformedProperties,
      data,
      observers,
      lifetimes,
      pageLifetimes,
      export: $export,
      created,
      attached,
      ready,
      moved,
      detached,
      error,
      methods,
      ...fields
    })
    props = injectActions(props)

    Component(props)
  }
}

interface WXComponentBehavior<P extends AnyObject = any, D extends AnyObject = any> extends Component.WXComponentBehavior<P, D> {}

class WXComponentBehavior<P extends AnyObject = any, D extends AnyObject = any> {
  public init(connect = identity) {
    let props: WXComponentBehavior<P, D> = collectClassProps(this, "init")

    const { constructor, init, behaviors, properties, data, created, attached, ready, moved, detached, error, ...others } = props

    props = checkMethodsProp(others)
    props = checkActionsProp(others)
    props = checkForbiddenProps(props)
    const transformedProperties = transformProperties(properties)
    const { fields, methods } = splitFieldsAndMethods(props)
    props = connect({
      behaviors,
      properties: transformedProperties,
      data,
      created,
      attached,
      ready,
      moved,
      detached,
      error,
      methods,
      ...fields
    })
    props = injectActions(props)

    return Behavior(props)
  }
}

function checkMethodsProp(props: any) {
  const { methods, ...others } = props
  if (methods) {
    throw new Error("WXComponent: 子类不应声明methods属性，应该直接写成类的方法")
  }
  return others
}

function checkActionsProp(props: any) {
  const { actions, ...others } = props
  if (actions) {
    throw new Error("WXComponent: 子类不应声明actions属性，这是给redux预留的，应当由redux注入")
  }
  return others
}

function checkForbiddenProps(props: any) {
  const {
    is,
    id,
    dataset,
    setData,
    triggerEvent,
    createSelectorQuery,
    createIntersectionObserver,
    selectComponent,
    selectAllComponents,
    getRelationNodes,
    groupSetData,
    getTabBar,
    getPageId,
    ...others
  } = props

  if (
    is ||
    id ||
    dataset ||
    setData ||
    triggerEvent ||
    createSelectorQuery ||
    createIntersectionObserver ||
    selectComponent ||
    selectAllComponents ||
    getRelationNodes ||
    groupSetData ||
    getTabBar ||
    getPageId
  ) {
    throw new Error("WXComponent: 子类中覆盖了微信内部的属性或变量，请检查")
  }

  return others
}

function transformProperties(properties: any) {
  if (!properties) {
    return
  }

  return Object.keys(properties).reduce((obj: any, key) => {
    const value = properties[key]

    let type: any
    switch (typeof value) {
      case "undefined":
      case "symbol":
      case "bigint":
        throw new Error(`WXComponent: 不支持的属性类型，key=${key}, type=${typeof value}`)
      case "boolean":
        type = Boolean
        break
      case "number":
        type = Number
        break
      case "string":
        type = String
        break
      case "function":
        type = null
        break
      case "object":
        if (value instanceof Array) {
          type = Array
        } else {
          type = Object
        }
        break
    }

    obj[key] = {
      type,
      value
    }

    return obj
  }, {})
}

function injectActions(props: any) {
  for (const k in props.actions) {
    props.methods["actions." + k] = props.actions[k]
  }
  return props
}

export { WXComponent, WXComponentBehavior }
