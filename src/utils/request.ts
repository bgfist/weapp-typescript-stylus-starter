import { wxp } from "@bgfist/weact"
import config from "../core/config"
import { error } from "./log"
import { reLaunch } from "./route"

const apiError = error("API ERROR")

const tokenManager = (function tokenManager() {
  const STORE_KEY_TOKEN = "token"

  return {
    getToken() {
      return wx.getStorageSync(STORE_KEY_TOKEN)
    },

    removeToken() {
      return wx.removeStorageSync(STORE_KEY_TOKEN)
    },

    setToken(token: string) {
      wx.setStorageSync(STORE_KEY_TOKEN, token)
    }
  }
})()

interface ApiResponse {
  code: 200 | 401 | number
  data: object
  msg: string
}

const tokenPassApis: { [api: string]: true } = {
  "/system_key": true
}

const request = async (options: RQ<wx.RequestOption>) => {
  let token = ""
  if (!tokenPassApis[options.url]) {
    token = tokenManager.getToken()
    if (!token) {
      return handleTokenInvalid()
    }
  }

  options = {
    ...options,
    url: config.baseUrl + options.url,
    header: {
      token,
      ...options.header
    }
  }

  // if (config.apiMode === "mock") {
  //   return wxp.request(options) as Promise<any>
  // }

  const res = await wxp.request(options).catch(err => {
    wx.showToast({
      title: "网络错误",
      icon: "none"
    })
    apiError("request报错", err)
    throw new Error(err)
  })

  return handleApiResponse(res)
}

const handleApiResponse = (res: any) => {
  const { code, data, msg } = res as ApiResponse
  if (code === 200) {
    return data as any
  }

  if (code === 401) {
    return handleTokenInvalid()
  }

  wx.showToast({
    title: msg,
    icon: "none"
  })
  apiError(msg)
  throw new Error(msg)
}

const handleTokenInvalid = () => {
  tokenManager.removeToken()
  reLaunch("login")
  throw new Error("token失效")
}

type RequestOption = Omit<RQ<wx.RequestOption>, "method">

export const saveToken = tokenManager.setToken
export const get = (options: RequestOption) => request({ method: "GET", ...options })
export const post = (options: RequestOption) => request({ method: "POST", ...options })
export const put = (options: RequestOption) => request({ method: "PUT", ...options })
