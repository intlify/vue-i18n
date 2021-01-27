const { baseCompile } = require('../packages/message-compiler')
const {
  translate,
  createCoreContext,
  clearCompileCache
} = require('../packages/core')
const { createI18n } = require('../packages/vue-i18n')
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
const ctx = createCoreContext({
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

console.log(`resolve time on composition: ${len} resources`)
const i18n = createI18n({
  legacy: false,
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

console.log(`resolve time on composition with compile cache: ${len} resources`)
start = convertHrtime(process.hrtime())
for (const [key] of Object.entries(simpleData)) {
  i18n.global.t(key)
}
end = convertHrtime(process.hrtime())
console.log(`ms: ${end.milliseconds - start.milliseconds}`)
