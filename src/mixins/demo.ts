import { WXComponentBehavior } from "../comp"

interface Properties {
  mixinName: string
}

interface Data {
  mixinAge: number
}

class DemoComp extends WXComponentBehavior<Properties, Data> {
  public properties: Properties = {
    mixinName: "mixin"
  }

  public data: Data = {
    mixinAge: 0
  }

  public lifetimes = {
    ready(this: DemoComp) {
      this.setData({
        mixinAge: 20
      })
    }
  }
}

export default new DemoComp().init()
