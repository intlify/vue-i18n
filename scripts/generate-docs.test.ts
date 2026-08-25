import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  collectGeneratedSymbolNames,
  generateApiDocs,
  isAllowedDiagnostic,
  normalizeGeneratedFiles,
  removeModulesSection
} from './generate-docs'
import { syncApiDocsLocales } from './generate-api-locales'
import baseline from './api-docs-symbol-baseline.json' with { type: 'json' }

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const requiredPages = [
  'createI18n',
  'useI18n',
  'Composer',
  'ComponentCustomProperties',
  'Path',
  'VERSION'
] as const

describe('generateApiDocs', () => {
  test('skips TypeDoc-style /modules/ pages', () => {
    const normalized = normalizeGeneratedFiles({
      'general/index.md':
        '# general\n\n## Modules\n\n- [Path](/general/modules/Path.md)\n\n## Types\n',
      'general/modules/Path.md': '# Path\n',
      'general/type-aliases/Path.md':
        '# Path\nSee [/general/modules/Path.md](/general/modules/Path.md)\n'
    })

    expect(Object.keys(normalized).sort()).toEqual([
      'general/index.md',
      'general/type-aliases/Path.md'
    ])
    expect(normalized['general/index.md']).toContain('## Types')
    expect(normalized['general/index.md']).not.toContain('## Modules')
    expect(normalized['general/type-aliases/Path.md']).toContain('/general/type-aliases/Path.md')
  })

  test('treats @internal exclusion as the only allowed diagnostic', () => {
    expect(
      isAllowedDiagnostic(
        'export "ComponentCustomOptions" from entrypoint "vue" was excluded from docs because it is marked @internal'
      )
    ).toBe(true)
    expect(isAllowedDiagnostic('export "Path" could not be resolved')).toBe(false)
  })

  test('removeModulesSection keeps later headings', () => {
    expect(removeModulesSection('# n\n\n## Modules\n\nx\n\n## Types\n\ny\n')).toBe(
      '# n\n\n## Types\n\ny\n'
    )
  })

  test('writes the TypeDoc public symbol set without touching v11 pages', async () => {
    const { files, diagnostics, outDir } = await generateApiDocs()
    const names = collectGeneratedSymbolNames(files)

    expect(names).toEqual([...baseline].sort())
    expect(names).not.toContain('ComponentCustomOptions')
    expect(diagnostics.filter((message: string) => !isAllowedDiagnostic(message))).toEqual([])

    for (const name of requiredPages) {
      const filePath = Object.keys(files).find(entry => entry.endsWith(`/${name}.md`))
      expect(filePath, `${name} page`).toBeTruthy()
      expect(files[filePath!].trim().length).toBeGreaterThan(0)
    }

    await access(path.join(outDir, 'v11/general.md'))
    await generateApiDocs()
    const second = await readFile(path.join(outDir, 'v11/general.md'), 'utf8')
    expect(second.length).toBeGreaterThan(0)

    await syncApiDocsLocales()
    const jpSidebar = await readFile(path.join(rootDir, 'docs/jp/api/api-sidebar.json'), 'utf8')
    const zhSidebar = await readFile(path.join(rootDir, 'docs/zh/api/api-sidebar.json'), 'utf8')
    expect(jpSidebar).toContain('/jp/api/')
    expect(jpSidebar.replaceAll('/jp/api/', '')).not.toContain('/api/')
    expect(zhSidebar).toContain('/zh/api/')
    expect(zhSidebar.replaceAll('/zh/api/', '')).not.toContain('/api/')
    await access(path.join(rootDir, 'docs/jp/api/v11/general.md'))
    await access(path.join(rootDir, 'docs/zh/api/v11/general.md'))
  }, 120_000)
})
