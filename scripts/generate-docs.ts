/**
 * Generate latest API markdown for VitePress.
 *
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { execFileSync } from 'node:child_process'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  generateOxContentApiDocs,
  toVitePressSidebarItems,
  type ApiDocsNavItem
} from 'vitepress-api-references'

import config from './api-docs.config'
import { isAllowedDiagnostic, normalizeGeneratedFiles } from './generate-docs-lib'

const GENERATED_DIRS = ['general', 'vue']
const GENERATED_FILES = ['index.md', 'api-sidebar.json']

export async function generateApiDocs(): Promise<{
  files: Record<string, string>
  nav: ApiDocsNavItem[]
  diagnostics: string[]
  outDir: string
}> {
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
    throw new Error(
      `API docs generation reported ${unexpected.length} unexpected diagnostic(s):\n${unexpected.join('\n')}`
    )
  }

  console.log(`Generated ${Object.keys(files).length} files`)
  return { files, nav: result.nav, diagnostics: result.diagnostics, outDir }
}

async function replaceGeneratedOutput(
  outDir: string,
  files: Record<string, string>,
  nav: ApiDocsNavItem[]
): Promise<void> {
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

function formatGeneratedFiles(outDir: string): void {
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
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isCli) {
  generateApiDocs().catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
}
