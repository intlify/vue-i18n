const {
  baseCompile
} = require('../packages/message-compiler/dist/message-compiler.cjs.prod.js')
const {
  clearCompileCache
} = require('../packages/runtime/dist/runtime.cjs.prod.js')
const {
  translate,
  createRuntimeContext
} = require('../packages/core/dist/core.cjs.prod.js')
const { createI18n } = require('../packages/vue-i18n/dist/vue-i18n.cjs.prod.js')
const convertHrtime = require('convert-hrtime')

const simpleData = require('./simple.json')
const len = Object.keys(simpleData).length

console.log('simple pattern ...')

console.log(`compile time: ${len} resources`)
let start = convertHrtime(process.hrtime())
for (const [, source] of Object.entries(simpleData)) {
  baseCompile(source)
}
let end = convertHrtime(process.hrtime())
console.log(`sec: ${end.seconds - start.seconds}`)
console.log(`ms: ${end.milliseconds - start.milliseconds}`)

console.log()

console.log(`resolve time with core: ${len} resources`)
const ctx = createRuntimeContext({
  locale: 'en',
  messages: {
    en: simpleData
  }
})
start = convertHrtime(process.hrtime())
for (const [key] of Object.entries(simpleData)) {
  translate(ctx, key)
}
end = convertHrtime(process.hrtime())
console.log(`ms: ${end.milliseconds - start.milliseconds}`)

clearCompileCache()
console.log()

console.log(`resolve time with composition: ${len} resources`)
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: simpleData
  }
})
start = convertHrtime(process.hrtime())
for (const [key] of Object.entries(simpleData)) {
  i18n.global.t(key)
}
end = convertHrtime(process.hrtime())
console.log(`ms: ${end.milliseconds - start.milliseconds}`)
