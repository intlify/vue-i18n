import { baseCompile } from '@intlify/message-compiler'
import { createCommonJS } from 'mlly'
import { displayMemoryUsage } from './utils.mjs'

const { require } = createCommonJS(import.meta.url)
const { Suite } = require('benchmark')

async function main() {
  console.log(`compilation:`)
  console.log()

  new Suite('compilation')
    .add(`compile simple message`, () => {
      baseCompile(`hello world`)
    })
    .add(`compile complex message`, () => {
      // eslint-disable-next-line no-irregular-whitespace
      baseCompile(`@.caml:{'no apples'} 0 | {0} apple 0 | {n}　apples 0`)
    })
    .on('error', event => {
      console.log(String(event.target))
    })
    .on('cycle', event => {
      console.log(String(event.target))
    })
    .run()

  displayMemoryUsage()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
