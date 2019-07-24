type Callback = AnyFunction
const eventCallbackMap: { [eventName: string]: Callback[] } = {}

export default {
  on(eventName: string, cb: AnyFunction) {
    const eventCallbackList = eventCallbackMap[eventName] || []
    eventCallbackList.push(cb)
    eventCallbackMap[eventName] = eventCallbackList

    return () => {
      eventCallbackList.splice(eventCallbackList.indexOf(cb), 1)
    }
  },

  emit(eventName: string, options?: any) {
    ;(eventCallbackMap[eventName] || []).forEach(cb => {
      cb(options)
    })
  }
}
