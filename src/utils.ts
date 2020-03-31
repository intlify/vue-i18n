export const isArray = Array.isArray
export const isNumber = (val: unknown): val is number =>
  typeof val === 'number' && isFinite(val)
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isBoolean = (val: unknown): val is boolean =>
  typeof val === 'boolean'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export const isObject = (val: unknown): val is Record<any, any> => // eslint-disable-line
  val !== null && typeof val === 'object'

export const isPromise = <T = any>(val: unknown): val is Promise<T> => { // eslint-disable-line
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export const isDate = (val: unknown): val is Date =>
  toTypeString(val) === '[object Date]'

export const isRegExp = (val: unknown): val is RegExp =>
  toTypeString(val) === '[object RegExp]'

export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]'

// for converting list and named values to displayed strings.
export const toDisplayString = (val: unknown): string => {
  return val == null
    ? ''
    : isArray(val) || (isPlainObject(val) && val.toString === objectToString)
    ? JSON.stringify(val, null, 2)
    : String(val)
}

export function warn(msg: string, err?: Error): void {
  if (typeof console !== 'undefined') {
    console.warn('[vue-i18n] ' + msg)
    /* istanbul ignore if */
    if (err) {
      console.warn(err.stack)
    }
  }
}
