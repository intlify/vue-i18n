import { execFileSync } from 'node:child_process'
import { access, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  isAllowedDiagnostic,
  labelOverloadHeadings,
  normalizeGeneratedFiles,
  removeModulesSection
} from './generate-docs-lib'
import baseline from './api-docs-symbol-baseline.json' with { type: 'json' }

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tsxCli = path.join(rootDir, 'node_modules', 'tsx', 'dist', 'cli.mjs')
const requiredPages = [
  'createI18n',
  'useI18n',
  'Composer',
  'ComponentCustomProperties',
  'Path',
  'VERSION'
] as const

async function walkMarkdown(dir: string, acc: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'v11') {
        await walkMarkdown(fullPath, acc)
      }
      continue
    }
    if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
      acc.push(fullPath)
    }
  }
  return acc
}

function runDocsScript(script: string): void {
  execFileSync(process.execPath, [tsxCli, script], { cwd: rootDir, stdio: 'inherit' })
}

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

  test('labelOverloadHeadings names the overloads in the headings', () => {
    const labeled = labelOverloadHeadings(
      {
        'general/interfaces/Composer.md': '# Composer\n',
        'general/interfaces/ComposerTranslation.md':
          '# ComposerTranslation\n\n## Call Signature\n\nfirst\n\n## Call Signature\n\nsecond\n',
        'general/interfaces/LocaleDetector.md': '# LocaleDetector\n\n## Call Signature\n\nonly\n',
        'vue/interfaces/ComponentCustomProperties.md':
          '# Properties\n\n### $t()\n\nfirst\n\n### $t()\n\nsecond\n\n### $te()\n\nonly\n'
      },
      [
        {
          entries: [
            {
              name: 'Composer',
              members: [{ name: 't', kind: 'property', type: 'ComposerTranslation<Messages>' }]
            },
            {
              name: 'ComposerTranslation',
              members: [
                { name: '', kind: 'callSignature', params: [{ name: 'key' }] },
                {
                  name: '',
                  kind: 'callSignature',
                  params: [{ name: 'key' }, { name: 'options', optional: true }]
                }
              ]
            },
            {
              name: 'LocaleDetector',
              members: [{ name: '', kind: 'callSignature', params: [{ name: 'args' }] }]
            },
            {
              name: 'ComponentCustomProperties',
              members: [
                { name: '$t', kind: 'method', params: [{ name: 'key' }] },
                { name: '$t', kind: 'method', params: [{ name: 'key' }, { name: 'plural' }] },
                { name: '$te', kind: 'method', params: [{ name: 'key' }] }
              ]
            }
          ]
        }
      ]
    )

    expect(labeled['general/interfaces/ComposerTranslation.md']).toBe(
      '# ComposerTranslation\n\n## t(key)\n\nfirst\n\n## t(key, options?)\n\nsecond\n'
    )
    expect(labeled['general/interfaces/LocaleDetector.md']).toContain('## Call Signature')
    expect(labeled['vue/interfaces/ComponentCustomProperties.md']).toBe(
      '# Properties\n\n### $t(key)\n\nfirst\n\n### $t(key, plural)\n\nsecond\n\n### $te()\n\nonly\n'
    )
  })

  test('writes the TypeDoc public symbol set without touching v11 pages', async () => {
    runDocsScript('./scripts/generate-docs.ts')
    const firstPages = await walkMarkdown(path.join(rootDir, 'docs/api'))
    const names = [...new Set(firstPages.map(filePath => path.basename(filePath, '.md')))].sort()

    expect(names).toEqual([...baseline].sort())
    expect(names).not.toContain('ComponentCustomOptions')

    for (const name of requiredPages) {
      const filePath = firstPages.find(entry => entry.endsWith(`${path.sep}${name}.md`))
      expect(filePath, `${name} page`).toBeTruthy()
      expect((await readFile(filePath!, 'utf8')).trim().length).toBeGreaterThan(0)
    }

    const v11Path = path.join(rootDir, 'docs/api/v11/general.md')
    const before = await readFile(v11Path, 'utf8')
    runDocsScript('./scripts/generate-docs.ts')
    expect(await readFile(v11Path, 'utf8')).toBe(before)

    runDocsScript('./scripts/generate-api-locales.ts')
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
