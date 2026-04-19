import { baseCompile } from '@intlify/message-compiler'
import { bench, run } from 'mitata'
import { displayMemoryUsage, parseArgs } from './utils.mjs'

const args = parseArgs()
console.log(`compilation:`)

bench(`compile simple message`, () => {
  baseCompile(`hello world`)
})

bench(`compile complex message`, () => {
  baseCompile(`@.caml:{'no apples'} 0 | {0} apple 0 | {n}　apples 0`)
})

await run(args)

displayMemoryUsage()
