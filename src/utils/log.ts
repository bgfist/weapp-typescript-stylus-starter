const createLogger = (color: string) => (namespace: string) => (...args: any[]) => console.log(`%c[${namespace}]`, `color: ${color}`, ...args)

export const debug = createLogger("blue")

export const info = createLogger("green")

export const warn = createLogger("yellow")

export const error = createLogger("red")
