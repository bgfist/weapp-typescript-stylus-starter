import { WXComponent } from "../../comp"
import DemoMixin from "../../mixins/demo"

interface Properties {
  name: string
}

interface Data {
  name: string
  age: number
}

class DemoComp extends WXComponent<Properties, Data> {
  public behaviors = [DemoMixin]

  public properties: Properties = {
    name: "jack"
  }

  public data: Data = {
    name: "ok",
    age: 0
  }

  public lifetimes = {
    ready(this: DemoComp) {
      this.setData({
        age: 25
      })
    }
  }

  private hasTappedAge = false

  private onAgeTap(e: wx.TouchEvent) {
    if (!this.hasTappedAge) {
      this.setData({
        age: this.data.age + 1
      })
      this.hasTappedAge = true
    }
  }
}

new DemoComp().init()
