import { wxp } from "@bgfist/weact"

export function pageUrl(page: string, query?: Record<string, any>) {
  let url = `/pages/${page}/${page}`
  if (query) {
    const querystring = Object.keys(query)
      .map(k => {
        const v = typeof query[k] === "object" ? encodeURIComponent(JSON.stringify(query[k])) : query[k]
        return `${k}=${v}`
      })
      .join("&")
    url += `?${querystring}`
  }
  return url
}

export function navigateTo(page: string, query?: Record<string, any>) {
  const url = pageUrl(page, query)
  return wxp.navigateTo({ url })
}

export function redirectTo(page: string, query?: Record<string, any>) {
  const url = pageUrl(page, query)
  return wxp.redirectTo({ url })
}

export function back(delta = 1) {
  return wxp.navigateBack({ delta })
}

export function reLaunch(page: string, query?: Record<string, any>) {
  const url = pageUrl(page, query)
  return wxp.reLaunch({ url })
}
