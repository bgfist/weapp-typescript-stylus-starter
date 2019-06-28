export function collectClassProps(obj: any, ...excludes: string[]) {
  const props: any = {}
  for (const k in obj) {
    // @ts-ignore
    props[k] = obj[k]
  }
  delete props.constructor
  excludes.forEach(exclude => delete props[exclude])
  return props
}

export function splitFieldsAndMethods(obj: any) {
  const fields: any = {}
  const methods: any = {}
  for (const k in obj) {
    if (typeof obj[k] === "function") {
      methods[k] = obj[k]
    } else {
      fields[k] = obj[k]
    }
  }
  return {
    fields,
    methods
  }
}

export function identity<T>(t: T) {
  return t
}
