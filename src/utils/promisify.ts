interface Option {
  success?: (res: any) => void
  fail?: (err: any) => void
  [propName: string]: any
}

export function promisify(method: string, options: Option = {}, thisArgs?: any) {
  return new Promise((resolve, reject) => {
    options.success = resolve
    options.fail = err => {
      console.error(err.errMsg)
      reject(err)
    }
    // @ts-ignore
    wx[method](options, thisArgs)
  })
}
