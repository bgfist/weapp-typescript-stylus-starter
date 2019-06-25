import { promisify } from "./promisify"

export function pageUrl(page: string, query?: string) {
  let url = `/pages/${page}/${page}`
  if (query) {
    url += `?${query}`
  }
  return url
}

export function navigateTo(page: string, query?: string) {
  const url = pageUrl(page, query)
  return promisify("navigateTo", { url })
}

export function redirectTo(page: string, query?: string) {
  const url = pageUrl(page, query)
  return promisify("redirectTo", { url })
}

export function back(delta = 1) {
  return promisify("navigateBack", { delta })
}
