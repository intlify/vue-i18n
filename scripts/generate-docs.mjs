/**
 * Generate latest API markdown for VitePress.
 *
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { execFileSync } from 'node:child_process'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { generateOxContentApiDocs, toVitePressSidebarItems } from 'vitepress-api-references'

import config from '../api-docs.config.mjs'

const GENERATED_DIRS = ['general', 'vue']
const GENERATED_FILES = ['index.md', 'api-sidebar.json']

/**
 * @param {string} message
 */
export function isAllowedDiagnostic(message) {
  return message.includes('was excluded from docs because it is marked @internal')
}

/**
 * @param {Record<string, string>} files
 */
export function normalizeGeneratedFiles(files) {
  const sourceModuleFiles = new Set(
    Object.keys(files).filter(filePath => filePath.includes('/modules/'))
  )
  const linkReplacements = createModuleLinkReplacements(files)
  /** @type {Record<string, string>} */
  const normalized = {}

  for (const [filePath, content] of Object.entries(files)) {
    if (sourceModuleFiles.has(filePath) || filePath.split(/[/\\]/)[0] === 'v11') {
      continue
    }

    normalized[filePath] = replaceModuleLinks(
      filePath.endsWith('/index.md') ? removeModulesSection(content) : content,
      linkReplacements
    )
  }

  return normalized
}

/**
 * @param {Record<string, string>} files
 */
export function collectGeneratedSymbolNames(files) {
  return Object.keys(files)
    .filter(
      filePath =>
        filePath.endsWith('.md') &&
        !filePath.endsWith('index.md') &&
        !filePath.includes('/modules/') &&
        filePath.split(/[/\\]/)[0] !== 'v11'
    )
    .map(filePath => path.basename(filePath, '.md'))
    .sort()
}

export async function generateApiDocs() {
  const result = await generateOxContentApiDocs({
    ...config,
    write: false
  })
  const files = normalizeGeneratedFiles(result.files)
  const outDir = result.resolvedOptions.outDir

  await replaceGeneratedOutput(outDir, files, result.nav)
  formatGeneratedFiles(outDir)

  const unexpected = result.diagnostics.filter(message => !isAllowedDiagnostic(message))
  for (const diagnostic of result.diagnostics) {
    console.warn(diagnostic)
  }
  if (unexpected.length > 0) {
    const error = new Error(
      `API docs generation reported ${unexpected.length} unexpected diagnostic(s)`
    )
    // @ts-expect-error diagnostics is for callers
    error.diagnostics = unexpected
    throw error
  }

  console.log(`Generated ${Object.keys(files).length} files`)
  return { files, nav: result.nav, diagnostics: result.diagnostics, outDir }
}

/**
 * @param {string} outDir
 * @param {Record<string, string>} files
 * @param {import('vitepress-api-references').ApiDocsNavItem[]} nav
 */
async function replaceGeneratedOutput(outDir, files, nav) {
  for (const name of GENERATED_DIRS) {
    await rm(path.join(outDir, name), { recursive: true, force: true })
  }
  for (const name of GENERATED_FILES) {
    await rm(path.join(outDir, name), { force: true })
  }
  await rm(path.join(outDir, 'typedoc-sidebar.json'), { force: true })

  for (const [filePath, content] of Object.entries(files)) {
    const outputPath = path.join(outDir, filePath)
    await mkdir(path.dirname(outputPath), { recursive: true })
    await writeFile(outputPath, content)
  }

  await writeFile(
    path.join(outDir, 'api-sidebar.json'),
    `${JSON.stringify(toVitePressSidebarItems(nav, { collapsed: true }))}\n`
  )
}

/**
 * @param {Record<string, string>} files
 */
function createModuleLinkReplacements(files) {
  const replacements = new Map()

  for (const filePath of Object.keys(files)) {
    const match = filePath.match(
      /^(?<module>.+)\/(?:functions|classes|interfaces|type-aliases|variables)\/(?<name>[^/]+)\.md$/
    )
    if (!match?.groups) {
      continue
    }

    replacements.set(`/${match.groups.module}/modules/${match.groups.name}.md`, `/${filePath}`)
  }

  return replacements
}

/**
 * @param {string} content
 * @param {Map<string, string>} replacements
 */
function replaceModuleLinks(content, replacements) {
  let next = content
  for (const [from, to] of replacements) {
    next = next.replaceAll(from, to)
  }
  return next
}

/**
 * @param {string} content
 */
export function removeModulesSection(content) {
  const sectionStart = content.indexOf('\n## Modules\n')
  if (sectionStart === -1) {
    return content
  }

  const nextSectionStart = content.indexOf('\n## ', sectionStart + 1)
  if (nextSectionStart === -1) {
    return `${content.slice(0, sectionStart).trimEnd()}\n`
  }

  return `${content.slice(0, sectionStart).trimEnd()}\n${content.slice(nextSectionStart)}`
}

/**
 * @param {string} outDir
 */
function formatGeneratedFiles(outDir) {
  const binaryName = process.platform === 'win32' ? 'oxfmt.cmd' : 'oxfmt'
  const oxfmt = path.join(process.cwd(), 'node_modules', '.bin', binaryName)

  execFileSync(
    oxfmt,
    [
      path.join(outDir, 'general'),
      path.join(outDir, 'vue'),
      path.join(outDir, 'index.md'),
      '--config',
      './node_modules/@kazupon/prettier-config/index.json',
      '--no-error-on-unmatched-pattern'
    ],
    { stdio: 'inherit' }
  )
}

const isCli =
  process.argv[1] !== undefined &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url

if (isCli) {
  await generateApiDocs()
}
