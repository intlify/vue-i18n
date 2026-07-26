import { create, isArray, isObject } from './utils'

const isNotObjectOrIsArray = (val: unknown) => !isObject(val) || isArray(val)

export function deepCopy(src: any, des: any): void {
  // src and des should both be objects, and none of them can be a array
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw new Error('Invalid value')
  }

  const stack = [{ src, des }]
  while (stack.length) {
    const { src, des } = stack.pop()!

    // using `Object.keys` which skips prototype properties
    Object.keys(src).forEach(key => {
      if (key === '__proto__') {
        return
      }

      const value = src[key]
      if (isArray(value)) {
        // replace arrays instead of merging them, without retaining source references
        const copied: unknown[] = []
        copied.length = value.length
        des[key] = copied
        stack.push({ src: value, des: copied })
      } else if (isObject(value)) {
        if (!isObject(des[key]) || isArray(des[key])) {
          des[key] = create()
        }
        stack.push({ src: value, des: des[key] })
      } else {
        des[key] = value
      }
    })
  }
}
