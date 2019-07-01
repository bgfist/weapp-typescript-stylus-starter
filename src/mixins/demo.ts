import { WXComponentBehavior } from "@bgfist/weact"
import { AppState } from "../store/index"
import { connect } from "@bgfist/weact-redux"

interface Properties {
  mixinName: string
}

interface Data {
  mixinAge: number
}

const mapStateToData = (state: AppState) => ({
  mixinNum: state.test.num
})

type RealData = Data & ReturnType<typeof mapStateToData>

class DemoComp extends WXComponentBehavior<Properties, RealData> {
  public properties: Properties = {
    mixinName: "mixin"
  }

  // @ts-ignore
  public data: RealData = {
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

export default new DemoComp().init(connect(mapStateToData))
