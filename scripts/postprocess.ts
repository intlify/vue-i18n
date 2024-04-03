import path from 'pathe'
import { promises as fs } from 'node:fs'

function replaceWithCompositionApi(source: string, target: string) {
  return source.replace(
    `{ ${target} } from 'vue';`,
    `{ ${target} } from '@vue/composition-api';`
  )
}

async function main() {
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

main().catch(err => {
  console.error(err)
  process.exit(1)
})
