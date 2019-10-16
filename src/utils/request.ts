import { wxp } from "@bgfist/weact"
import config from "../core/config"
import { error } from "./log"
import { reLaunch, redirectTo } from "./route"

const apiError = error("API ERROR")

interface ApiResponse {
  code: 200 | 401 | 403 | 3000 | number
  data: object
  msg: string
}

export const tokenManager = (function tokenManager() {
  const STORE_KEY_TOKEN = "token"
  let tokenCache = ""

  return {
    getToken() {
      if (!tokenCache) {
        tokenCache = wx.getStorageSync(STORE_KEY_TOKEN)
      }
      return tokenCache
    },

    removeToken() {
      wx.removeStorageSync(STORE_KEY_TOKEN)
      tokenCache = ""
    },

    setToken(token: string) {
      wx.setStorageSync(STORE_KEY_TOKEN, token)
      tokenCache = token
    }
  }
})()

type RequestOptions = RQ<wx.RequestOption> & { baseUrl?: string; auth?: boolean }

const req = async (options: RequestOptions) => {
  const { baseUrl = config.baseUrl, url, auth = true, ...otherOptions } = options

  const token = tokenManager.getToken()

  if (auth && !token) {
    goLogin()
    throw new Error("需要登录")
  }

  const reqOptions = {
    ...otherOptions,
    url: baseUrl + url,
    header: {
      token: auth ? token : undefined,
      ...otherOptions.header
    }
  }

  if (config.apiMode === "mock") {
    return wxp.request(reqOptions) as Promise<any>
  }

  const res = await wxp.request(reqOptions).catch(err => {
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
    tokenManager.removeToken()
    goLogin()
    throw new Error("token失效")
  }

  if (code === 3000) {
    redirectTo("error", { error: msg })
    throw new Error("没有权限访问")
  }

  wx.showToast({
    title: msg,
    icon: "none"
  })

  apiError(msg)

  throw new Error(msg)
}

export const goLogin = () => reLaunch("welcome")

type RequestOption = Omit<RequestOptions, "method">

export const get = (options: RequestOption) => req({ method: "GET", ...options })
export const post = (options: RequestOption) => req({ method: "POST", ...options })
export const put = (options: RequestOption) => req({ method: "PUT", ...options })
