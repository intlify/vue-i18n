const {
  baseCompile,
  translate,
  createRuntimeContext,
  clearCompileCache,
  createI18n
} = require('../dist/vue-i18n.cjs.prod')
const convertHrtime = require('convert-hrtime')

const data = require('./complex.json')
const len = Object.keys(data).length

console.log('complex pattern ...')

console.log(`compile time: ${len} resources`)
let start = convertHrtime(process.hrtime())
for (const [, source] of Object.entries(data)) {
  baseCompile(source)
}
let end = convertHrtime(process.hrtime())
console.log(`ms: ${end.milliseconds - start.milliseconds}`)

console.log()

console.log(`resolve time with core: ${len} resources`)
const ctx = createRuntimeContext({
  locale: 'en',
  modifiers: {
    caml: val => val
  },
  messages: {
    en: data
  }
})
start = convertHrtime(process.hrtime())
for (const [key] of Object.entries(data)) {
  translate(ctx, key, 2)
}
end = convertHrtime(process.hrtime())
console.log(`sec: ${end.seconds - start.seconds}`)
console.log(`ms: ${end.milliseconds - start.milliseconds}`)

clearCompileCache()
console.log()

console.log(`resolve time with composition: ${len} resources`)
const i18n = createI18n({
  locale: 'en',
  modifiers: {
    caml: val => val
  },
  messages: {
    en: data
  }
})
start = convertHrtime(process.hrtime())
for (const [key] of Object.entries(data)) {
  i18n.global.t(key, 2)
}
end = convertHrtime(process.hrtime())
console.log(`ms: ${end.milliseconds - start.milliseconds}`)
