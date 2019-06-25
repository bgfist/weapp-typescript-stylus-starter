import { collectClassProps } from "./utils/lang"

interface WXPage<T extends AnyObject = {}> extends Page.WXPage<T> {}

class WXPage<T extends AnyObject = {}> {
  public init() {
    const options = collectClassProps(this, "init")
    Page(options)
  }
}

export default WXPage
