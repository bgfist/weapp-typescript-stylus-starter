import { get } from "../utils/request"
import { wxp } from "@bgfist/weact"

type Omitable<T> = T extends undefined ? undefined | "" : T
type Params<T> = { [k in keyof T]: Omitable<T[k]> } // 可选参数可以不传这个字段或者传空字符串
type Response<T> = Promise<{ [k in keyof T]-?: Omitable<T[k]> }> // 返回的可选字段若无值将返回空字符串
export type ApiParams<F> = F extends AnyFunction ? Parameters<F>[0] : never
export type ApiResponse<F> = F extends (...args: any[]) => Promise<infer T> ? T : never

export const demoApi = (data: Params<{ page?: number }>): Response<{ list: string[] }> => get({ url: "/", data })

export const getWeatherList = async (): Promise<Array<{ day: string; wea: string }>> => {
  let res = (await wxp.request({
    method: "GET",
    url: "https://www.tianqiapi.com/api/?version=v1&cityid=101200101&city=%E9%9D%92%E5%B2%9B&ip=27.193.13.255&callback=%20"
  })) as string
  res = res.trim()
  res = res.substring(1, res.length - 1)
  const list = JSON.parse(res)
  return list.data
}
