import { WXPage } from "@bgfist/weact"
import { pageUrl } from "../../utils/route"
import { connect } from "@bgfist/weact-redux"
import { AppState, addTest, doubleTest } from "../../store/index"

interface Data {
  userInfo: {
    name: string
    age: number
  }
  materials: Array<{ id: number; title: string }>
}

const mapStateToData = (state: AppState) => ({
  testNum: state.test.num
})

const mapDispatchToActions = {
  addTest,
  doubleTest
}

type RealData = Data & ReturnType<typeof mapStateToData>

class MinePage extends WXPage<RealData, typeof mapDispatchToActions> {
  // @ts-ignore
  public data: RealData = {
    userInfo: {
      name: "QingYang",
      age: 10
    },
    materials: [
      {
        id: 1,
        title: "GOOD"
      }
    ]
  }

  private field = 0

  public onShareAppMessage(options: Page.IShareAppMessageOption) {
    this.setData(
      {
        userInfo: {
          name: "QY",
          age: 12
        }
      },
      this.method
    )
    return {
      title: "我的财富值",
      path: pageUrl("mine")
    }
  }

  private method() {
    console.log("method", this.field)
  }

  private onTap() {
    this.actions.addTest(2)
  }
}

new MinePage().init(
  connect(
    mapStateToData,
    mapDispatchToActions
  )
)
