import { promisify } from "./promisify"

const req = (path: string, params = {}, method = "GET") => {
  const options = {
    url: path,
    data: params,
    method,
    header: {
      "content-type": "application/x-www-form-urlencoded"
    }
  }

  return promisify("request", options)
}

export const post = (path: string, data: any) => req(path, data, "POST")
export const get = (path: string, data: any) => req(path, data)
