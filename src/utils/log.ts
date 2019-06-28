export const debug = (namespace: string) => (...args: any[]) => console.log("%c" + namespace, "color: green", ...args)
