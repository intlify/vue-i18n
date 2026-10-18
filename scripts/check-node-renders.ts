//
// Checks that vue-i18n and petite-vue-i18n render on Node.js without bundlers, in development and production,
// after `pnpm build`:
//
// - the Node.js builds, which Node.js loads for the package names
// - the bundler builds, which Node.js loads when a bundler alias to them, such as the one of
//   `@intlify/unplugin-vue-i18n`, is left external in an SSR build. Node.js loads the CommonJS build of Vue,
//   which does not set the feature flags of Vue, such as `__VUE_PROD_DEVTOOLS__`
//

import { spawnSync } from 'node:child_process'
import path from 'node:path'

const packagesDir = path.resolve(process.cwd(), 'packages')

// the builds, and their messages (the runtime-only builds have no message compiler)
const RENDERS: [target: string, specifier: string, message: string][] = [
  ['vue-i18n', 'vue-i18n', `'hello'`],
  ['vue-i18n', 'vue-i18n/dist/vue-i18n.esm-bundler.js', `'hello'`],
  [
    'vue-i18n',
    'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
    `() => 'hello'`
  ],
  ['petite-vue-i18n', 'petite-vue-i18n', `'hello'`],
  [
    'petite-vue-i18n',
    'petite-vue-i18n/dist/petite-vue-i18n.esm-bundler.js',
    `'hello'`
  ],
  [
    'petite-vue-i18n',
    'petite-vue-i18n/dist/petite-vue-i18n.runtime.esm-bundler.js',
    `() => 'hello'`
  ]
]

// renders a component that calls `useI18n()`, and prints the HTML,
// or the error of `install()`, which is async and which `app.use()` does not wait for
function renderModule(specifier: string, message: string): string {
  return `
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createI18n, useI18n } from '${specifier}'

const errors = []
process.on('unhandledRejection', error => errors.push(String(error)))
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { hello: ${message} } }
})
const app = createSSRApp({
  setup() {
    const { t } = useI18n()
    return () => h('p', t('hello'))
  }
})
app.use(i18n)
const html = await renderToString(app)
await new Promise(resolve => setTimeout(resolve))
console.log(errors.length ? errors.join('\\n') : html)
`
}

function main(): void {
  const errors: string[] = []
  let count = 0
  for (const [target, specifier, message] of RENDERS) {
    for (const env of ['development', 'production']) {
      count++
      // the package imports itself by its name, and `vue` from its `node_modules`
      const { status, stdout, stderr } = spawnSync(
        process.execPath,
        ['--input-type=module', '--eval', renderModule(specifier, message)],
        {
          cwd: path.resolve(packagesDir, target),
          env: { ...process.env, NODE_ENV: env },
          encoding: 'utf8'
        }
      )
      const output = stdout.trim()
      if (status !== 0 || output !== '<p>hello</p>') {
        errors.push(
          `${specifier}: renders ${JSON.stringify(output)} on Node.js with NODE_ENV=${env}, ` +
            `not "<p>hello</p>"${stderr.trim() ? `\n${stderr.trim()}` : ''}`
        )
      }
    }
  }

  if (errors.length) {
    for (const error of errors) {
      console.error(error)
    }
    process.exit(1)
  }
  console.log(`${count} renders on Node.js without bundlers succeed.`)
}

main()
