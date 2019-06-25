import { collectClassProps, splitFieldsAndMethods } from "./utils/lang"

interface WXComponent<P extends AnyObject = any, D extends AnyObject = any> extends Component.WXComponent<P, D> {}

class WXComponent<P extends AnyObject = any, D extends AnyObject = any> {
  public init() {
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
    props = checkForbiddenProps(props)
    const transformedProperties = transformProperties(properties)
    const { fields, methods } = splitFieldsAndMethods(props)

    Component({
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
  }
}

interface WXComponentBehavior<P extends AnyObject = any, D extends AnyObject = any> extends Component.WXComponentBehavior<P, D> {}

class WXComponentBehavior<P extends AnyObject = any, D extends AnyObject = any> {
  public init() {
    let props: WXComponentBehavior<P, D> = collectClassProps(this, "init")

    const { constructor, init, behaviors, properties, data, created, attached, ready, moved, detached, error, ...others } = props

    props = checkMethodsProp(others)
    props = checkForbiddenProps(props)
    const transformedProperties = transformProperties(properties)
    const { fields, methods } = splitFieldsAndMethods(props)

    return Behavior({
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
  }
}

function checkMethodsProp(props: any) {
  const { methods, ...others } = props
  if (methods) {
    throw new Error("WXComponent: 子类不应声明methods属性，应该直接写成类的方法")
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

export { WXComponent, WXComponentBehavior }
