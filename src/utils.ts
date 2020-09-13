/**
 * Original Utilities
 * written by kazuya kawaguchi
 */

const RE_ARGS = /\{([0-9a-zA-Z]+)\}/g

/* eslint-disable */
export function format(message: string, ...args: any): string {
  if (args.length === 1 && isObject(args[0])) {
    args = args[0]
  }
  if (!args || !args.hasOwnProperty) {
    args = {}
  }
  return message.replace(
    RE_ARGS,
    (match: string, identifier: string): string => {
      return args.hasOwnProperty(identifier) ? args[identifier] : ''
    }
  )
}

/** @internal */
export const generateFormatCacheKey = (
  locale: string,
  key: string,
  source: string
): string => friendlyJSONstringify({ l: locale, k: key, s: source })

/** @internal */
export const friendlyJSONstringify = (json: unknown): string =>
  JSON.stringify(json)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
    .replace(/\u0027/g, '\\u0027')

export const isNumber = (val: unknown): val is number =>
  typeof val === 'number' && isFinite(val)

export const isDate = (val: unknown): val is Date =>
  toTypeString(val) === '[object Date]'

export const isRegExp = (val: unknown): val is RegExp =>
  toTypeString(val) === '[object RegExp]'

export const isEmptyObject = (val: unknown): val is boolean =>
  isPlainObject(val) && Object.keys(val).length === 0

export function warn(msg: string, err?: Error): void {
  if (typeof console !== 'undefined') {
    console.warn('[vue-i18n] ' + msg)
    /* istanbul ignore if */
    if (err) {
      console.warn(err.stack)
    }
  }
}

let _globalThis: any
export const getGlobalThis = (): any => {
  // prettier-ignore
  return (
    _globalThis ||
    (_globalThis =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
          ? self
          : typeof window !== 'undefined'
            ? window
            : typeof global !== 'undefined'
              ? global
              : {})
  )
}

/* eslint-enable */

/**
 * Useful Utilites By Evan you
 * Modified by kazuya kawaguchi
 * MIT License
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/index.ts
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/codeframe.ts
 */
export const isArray = Array.isArray
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

const RANGE = 2

export function generateCodeFrame(
  source: string,
  start = 0,
  end = source.length
): string {
  const lines = source.split(/\r?\n/)
  let count = 0
  const res: string[] = []
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + 1
    if (count >= start) {
      for (let j = i - RANGE; j <= i + RANGE || end > count; j++) {
        if (j < 0 || j >= lines.length) continue
        const line = j + 1
        res.push(`${line}${' '.repeat(3 - String(line).length)}|  ${lines[j]}`)
        const lineLength = lines[j].length
        if (j === i) {
          // push underline
          const pad = start - (count - lineLength) + 1
          const length = Math.max(
            1,
            end > count ? lineLength - pad : end - start
          )
          res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length))
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1)
            res.push(`   |  ` + '^'.repeat(length))
          }
          count += lineLength + 1
        }
      }
      break
    }
  }
  return res.join('\n')
}
