export const isObject = (val: unknown): val is Record<any, any> => // eslint-disable-line
  val !== null && typeof val === 'object'
