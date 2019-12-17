type Omitable<T> = T extends undefined ? undefined | "" : T
type Params<T> = { [k in keyof T]: Omitable<T[k]> } // 可选参数可以不传这个字段或者传空字符串
type Response<T> = Promise<{ [k in keyof T]-?: Omitable<T[k]> }> // 返回的可选字段若无值将返回空字符串
type APIParams<F> = F extends AnyFunction ? Parameters<F>[0] : never
type APIResponse<F> = F extends (...args: any[]) => Promise<infer T> ? T : never

interface Pageable {
  page?: number
  limit?: number
}

interface Searchable {
  keyword?: string
}

interface IdBundle {
  id: number
}

interface DateRange {
  start: string
  end: string
}

interface Pagination<T> {
  total_count: number
  items: T[]
}

type Bool = 0 | 1

declare namespace API {
  const enum RoleType {
    SuperManager = 1,
    PlainManager = 2,
    Staff = 3
  }
}
