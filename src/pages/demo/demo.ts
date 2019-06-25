import WXPage from "../../page"
import { pageUrl } from "../../utils/route"
import { Material } from "../../types"

interface Data {
  userInfo: {
    name: string
    age: number
  }
  materials: Material[]
}

class MinePage extends WXPage<Data> {
  public data: Data = {
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
}

new MinePage().init()
