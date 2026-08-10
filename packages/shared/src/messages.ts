import { create, isArray, isObject } from './utils'

const isNotObjectOrIsArray = (val: unknown) => !isObject(val) || isArray(val)

export function deepCopy(src: any, des: any): void {
  // src and des should both be objects, and none of them can be a array
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw new Error('Invalid value')
  }

  // each pending node rides two adjacent stack slots rather than a `{ src, des }` wrapper,
  // so walking a message tree does not allocate once per container it visits
  const stack: any[] = [src, des]
  while (stack.length) {
    const des = stack.pop()
    const src = stack.pop()

    // using `Object.keys` which skips prototype properties
    const keys = Object.keys(src)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (key === '__proto__') {
        continue
      }

      const value = src[key]
      // leaves outnumber containers in a message tree, so they settle before any other test
      if (!isObject(value)) {
        des[key] = value
        continue
      }

      if (isArray(value)) {
        // replace arrays instead of merging them, without retaining source references
        const copied: unknown[] = []
        copied.length = value.length
        des[key] = copied
        stack.push(value, copied)
        continue
      }

      let desValue = des[key]
      if (!isObject(desValue) || isArray(desValue)) {
        desValue = des[key] = create()
      }
      stack.push(value, desValue)
    }
  }
}
