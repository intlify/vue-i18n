import { baseCompile } from '@intlify/message-compiler'
import { bench, run } from 'mitata' // eslint-disable-line import/namespace -- FIXME:
import { displayMemoryUsage, parseArgs } from './utils.mjs' // eslint-disable-line import/extensions -- FIXME:

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
