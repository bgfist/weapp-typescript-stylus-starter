import WXPage from "../../page"
import { pageUrl } from "../../utils/route"
import { Material } from "../../types"

import { connect } from "../../weapp-redux/index"
import { State } from "../../store/state/index"
import { addTest, doubleTest } from "../../store/actions/index"

function mapStateToData(state: State) {
  return {
    testNum: state.test.num
  }
}

const mapDispatchToActions = {
  addTest,
  doubleTest
}

interface Data {
  userInfo: {
    name: string
    age: number
  }
  materials: Material[]
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
    console.log("onTap")
    console.log(this.actions)
    this.actions.addTest(2)
  }
}

new MinePage().init(
  connect(
    mapStateToData,
    mapDispatchToActions
  )
)
