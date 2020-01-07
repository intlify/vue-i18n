export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'