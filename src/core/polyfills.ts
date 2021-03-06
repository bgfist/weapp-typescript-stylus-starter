interface Promise<T> {
  finally(cb: (res?: T, err?: any) => void): this
  onError(cb: (err?: any) => void): this
}

Promise.prototype.finally = function(cb: (res?: any, err?: any) => any) {
  return this.then(
    res => {
      cb(res, undefined)
      return res
    },
    err => {
      cb(undefined, err)
      throw err
    }
  )
}

Promise.prototype.onError = function(cb: (err?: any) => any) {
  return this.catch(err => {
    cb(err)
    throw err
  })
}
