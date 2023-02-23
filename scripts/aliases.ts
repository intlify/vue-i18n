import { readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const resolveEntryForPkg = p =>
  resolve(fileURLToPath(import.meta.url), `../../packages/${p}/src/index.ts`)

const dirs = readdirSync(new URL('../packages', import.meta.url))

const entries = {
  'vue-i18n': resolveEntryForPkg('vue-i18n'),
  'vue-i18n-bridge': resolveEntryForPkg('vue-i18n-bridge'),
  'petite-vue-i18n': resolveEntryForPkg('petite-vue-i18n')
}

const nonSrcPackages = [
  'size-check-core',
  'size-check-vue-i18n',
  'size-check-petite-vue-i18n',
  'format-explorer'
]

for (const dir of dirs) {
  const key = `@intlify/${dir}`
  if (
    !(
      dir === 'vue-i18n' ||
      dir === 'vue-i18n-bridge' ||
      dir === 'petite-vue-i18n'
    ) &&
    !nonSrcPackages.includes(dir) &&
    !(key in entries) &&
    statSync(new URL(`../packages/${dir}`, import.meta.url)).isDirectory()
  ) {
    entries[key] = resolveEntryForPkg(dir)
  }
}

export { entries }
