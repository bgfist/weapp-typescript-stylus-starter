/**
 * 微信授权步骤：
 *  1. 调用 wx.getSetting 查看用户是否已经授权，未授权进行第2步，已授权跳到第7步；
 *  2. 查看当前是否正在授权，等待之前的授权进行完。这个是为了防止两项授权同时进行造成的冲突；
 *  3. 调用 wx.authorize 进行授权，授权成功跳到第7步，授权失败进行第4步；
 *  4. 弹窗告知用户授权失败，用户只能点击确定；
 *  5. 用户点击确定后调用 wx.openSetting 前往授权设置页；
 *  6. 如果用户在授权设置页未打开所需授权，则跳到第四步；
 *  7. 授权成功。
 */

import { wxp } from "@bgfist/weact"

const authMap = {
  userInfo: "用户信息",
  record: "录音功能",
  userLocation: "地理位置",
  address: "通讯地址",
  invoiceTitle: "发票抬头",
  werun: "微信运动步数",
  writePhotosAlbum: "保存到相册功能",
  camera: "摄像头"
}

const repeatForceAuth = (scope: keyof typeof authMap): Promise<void> =>
  wxp
    .showModal({
      title: "提示",
      content: `小程序需要使用您的${authMap[scope]}，请前往授权`,
      showCancel: false
    })
    .then(() => wxp.openSetting())
    .then(res => {
      const scopeStr = `scope.${scope}` as keyof wx.AuthSetting
      if (!res.authSetting[scopeStr]) {
        return repeatForceAuth(scope)
      }
      return
    })

const makeAuthReq = (scope: keyof typeof authMap) => wxp.authorize({ scope: `scope.${scope}` }).catch(() => repeatForceAuth(scope))

let currentAuthRequest: Promise<any>

const authorize = (scope: keyof typeof authMap) =>
  wxp
    .getSetting()
    .catch(() => {
      throw new Error(`getSetting获取${scope}授权设置失败`)
    })
    .then(res => {
      const authScope = `scope.${scope}` as keyof wx.AuthSetting
      if (!res.authSetting[authScope]) {
        if (!currentAuthRequest) {
          // 查看当前是否正在授权，等待之前的授权进行完
          currentAuthRequest = makeAuthReq(scope)
        } else {
          currentAuthRequest = currentAuthRequest.then(() => makeAuthReq(scope))
        }
        return currentAuthRequest
      }
      return
    })

export { authorize }
