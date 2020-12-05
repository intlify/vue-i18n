import { baseCompile } from '@intlify/compiler'

export function translate(key: string): string {
  return key
}

baseCompile()

console.log('hello core!')
