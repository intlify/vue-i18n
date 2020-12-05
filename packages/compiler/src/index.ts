import { isObject } from '@intlify/shared'

export function baseCompile(): void {
  console.log('call baseCompile')
}

console.log('hello compiler!', isObject({}))
