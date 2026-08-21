import { readFile } from 'node:fs/promises'
import path from 'node:path'

type Matcher = string | RegExp

const root = process.cwd()

async function read(relativePath: string): Promise<string> {
  return readFile(path.resolve(root, relativePath), 'utf8')
}

function describeMatcher(matcher: Matcher): string {
  return typeof matcher === 'string' ? JSON.stringify(matcher) : `${matcher}`
}

function includes(source: string, matcher: Matcher): boolean {
  return typeof matcher === 'string'
    ? source.includes(matcher)
    : matcher.test(source)
}

function expectMatch(
  source: string,
  matcher: Matcher,
  file: string,
  expectation: string
): void {
  if (!includes(source, matcher)) {
    throw new Error(
      `${file}: expected ${expectation} (${describeMatcher(matcher)})`
    )
  }
}

function expectNoMatch(
  source: string,
  matcher: Matcher,
  file: string,
  expectation: string
): void {
  if (includes(source, matcher)) {
    throw new Error(
      `${file}: expected no ${expectation} (${describeMatcher(matcher)})`
    )
  }
}

async function main(): Promise<void> {
  const coreMjsFile = 'packages/vue-i18n-core/dist/vue-i18n-core.mjs'
  const coreBrowserFile =
    'packages/vue-i18n-core/dist/vue-i18n-core.esm-browser.js'
  const coreGlobalFile = 'packages/vue-i18n-core/dist/vue-i18n-core.global.js'
  const coreCjsFile = 'packages/vue-i18n-core/dist/vue-i18n-core.cjs'
  const consumerFile = 'packages/size-check-vue-i18n/dist/assets/index.js'

  const [coreMjs, coreBrowser, coreGlobal, coreCjs, consumer] =
    await Promise.all([
      read(coreMjsFile),
      read(coreBrowserFile),
      read(coreGlobalFile),
      read(coreCjsFile),
      read(consumerFile)
    ])

  expectMatch(
    coreMjs,
    '__VUE_INSTANCE_SETTERS__',
    coreMjsFile,
    'Vue instance setter registration'
  )
  expectMatch(
    coreMjs,
    /import\s*\{[^}]*getCurrentInstance[^}]*\}\s*from\s*['"]vue['"]/,
    coreMjsFile,
    'named Vue getCurrentInstance import'
  )
  expectMatch(
    coreMjs,
    /mirroredCurrentInstance\s*\?\?\s*getCurrentInstance[^\n]*\(\)/,
    coreMjsFile,
    'public getCurrentInstance fallback'
  )
  expectNoMatch(
    coreMjs,
    /import\s+\*\s+as\s+\w+\s+from\s+['"]vue['"]/,
    coreMjsFile,
    'Vue namespace import'
  )
  expectNoMatch(
    coreMjs,
    /const key = ['"]currentInstance['"]/,
    coreMjsFile,
    'currentInstance dynamic probe'
  )

  expectMatch(
    coreBrowser,
    /import\s+\*\s+as\s+\w+\s+from\s+['"]vue['"]/,
    coreBrowserFile,
    'Vue namespace compatibility import'
  )
  expectMatch(
    coreBrowser,
    /const key = ['"]currentInstance['"]/,
    coreBrowserFile,
    'currentInstance compatibility key'
  )
  expectMatch(
    coreBrowser,
    /\bkey\s+in\s+\w+/,
    coreBrowserFile,
    'browser in fallback'
  )
  expectMatch(
    coreBrowser,
    /return\s+getCurrentInstance(?:\$\d+)?\(\)/,
    coreBrowserFile,
    'browser public getCurrentInstance fallback'
  )

  expectMatch(
    coreGlobal,
    /const key = ['"]currentInstance['"]/,
    coreGlobalFile,
    'currentInstance compatibility key'
  )
  expectMatch(
    coreGlobal,
    /\bkey\s+in\s+\w+/,
    coreGlobalFile,
    'global in fallback'
  )
  expectMatch(
    coreGlobal,
    /return\s+\w+\.getCurrentInstance\(\)/,
    coreGlobalFile,
    'global public getCurrentInstance fallback'
  )

  expectMatch(coreCjs, /\bkey\s+in\s+\w+/, coreCjsFile, 'CJS in fallback')
  expectMatch(
    coreCjs,
    /\.getCurrentInstance\(\)/,
    coreCjsFile,
    'CJS public getCurrentInstance fallback'
  )

  for (const symbol of [
    'createVaporApp',
    'defineVaporComponent',
    'VaporFragment',
    'createForSlots'
  ]) {
    expectNoMatch(consumer, symbol, consumerFile, `Vapor symbol ${symbol}`)
  }

  console.log('Vapor compatibility and tree-shaking artifacts are valid.')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
