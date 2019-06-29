const createLogger = (color: string, method: "log" | "info" | "warn" | "error") => (namespace: string) => (...args: any[]) =>
  console[method]("%c" + namespace, `color: ${color}`, ...args)

export const debug = createLogger("blue", "log")

export const info = createLogger("green", "info")

export const warn = createLogger("yellow", "warn")

export const error = createLogger("red", "error")
