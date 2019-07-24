import { get } from "../utils/request"

type Omitable<T> = T extends undefined ? undefined | "" : T
type Params<T> = { [k in keyof T]: Omitable<T[k]> } // 可选参数可以不传这个字段或者传空字符串
type Response<T> = Promise<{ [k in keyof T]-?: Omitable<T[k]> }> // 返回的可选字段若无值将返回空字符串
export type ApiParams<F> = F extends AnyFunction ? Parameters<F>[0] : never
export type ApiResponse<F> = F extends (...args: any[]) => Promise<infer T> ? T : never

export const demoApi = (data: Params<{ page?: number }>): Response<{ list: string[] }> => get({ url: "/", data })
