import { WXComponent } from "@bgfist/weact"
import DemoMixin from "../../mixins/demo"

import { doubleTest } from "../../store/actions/index"
import { connect } from "@bgfist/weact-redux"

interface Properties {
  name: string
}

interface Data {
  age: number
}

const mapDispatchToActions = {
  doubleTest
}

class DemoComp extends WXComponent<Properties, Data, typeof mapDispatchToActions> {
  public behaviors = [DemoMixin]

  public properties: Properties = {
    name: "jack"
  }

  public data: Data = {
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

new DemoComp().init(
  connect(
    undefined,
    mapDispatchToActions
  )
)
