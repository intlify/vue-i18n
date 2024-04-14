import path from 'pathe'
import { promises as fs } from 'node:fs'

function replaceWithCompositionApi(source: string, target: string) {
  return source.replace(
    `{ ${target} } from 'vue';`,
    `{ ${target} } from '@vue/composition-api';`
  )
}

async function replaceVueI18nBridge() {
  let source = await fs.readFile(
    path.resolve(
      __dirname,
      '../packages/vue-i18n-bridge/dist/vue-i18n-bridge.d.ts'
    ),
    'utf8'
  )

  source = [
    'App',
    'ComponentInternalInstance',
    'ComputedRef',
    'InjectionKey',
    'WritableComputedRef'
  ].reduce(
    (source, target) => replaceWithCompositionApi(source, target),
    source
  )

  await fs.writeFile(
    path.resolve(
      __dirname,
      '../packages/vue-i18n-bridge/dist/vue-i18n-bridge.d.ts'
    ),
    source
  )
}

const RE_TRIPLE_SLASH_REFERENCE = /\/\/\/ <reference types="([^"]*)" \/>/

function replaceTripleSlashReference(source: string) {
  return source
    .replace(RE_TRIPLE_SLASH_REFERENCE, ``)
    .replace(RE_TRIPLE_SLASH_REFERENCE, '')
}

async function replaceMessageCompiler() {
  let source = await fs.readFile(
    path.resolve(
      __dirname,
      '../packages/message-compiler/dist/message-compiler.d.ts'
    ),
    'utf8'
  )

  source = replaceTripleSlashReference(source)

  await fs.writeFile(
    path.resolve(
      __dirname,
      '../packages/message-compiler/dist/message-compiler.d.ts'
    ),
    source
  )
}

async function main() {
  await replaceVueI18nBridge()
  await replaceMessageCompiler()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
