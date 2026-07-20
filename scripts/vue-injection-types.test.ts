import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { generateVueInjectionModuleAugmentation } from './vue-injection-types'

const sourcePath = fileURLToPath(new URL('../packages/vue-i18n/src/vue.ts', import.meta.url))
const injectionInterfaceNames = new Set(['ComponentCustomOptions', 'ComponentCustomProperties'])

describe('generateVueInjectionModuleAugmentation', () => {
  test('keeps generated signatures aligned with the canonical declarations', async () => {
    const source = await readFile(sourcePath, 'utf8')
    const generated = generateVueInjectionModuleAugmentation(source)

    expect(collectSignatures(generated)).toEqual(collectSignatures(source))
    expect(
      Array.from(
        generated.matchAll(/DefinedNumberFormat extends RemovedIndexResources<([\w$]+)>/g),
        match => match[1]
      )
    ).toMatchInlineSnapshot(`
      [
        "DefineNumberFormat",
        "DefineNumberFormat",
        "DefineNumberFormat",
        "DefineNumberFormat",
      ]
    `)
  })

  test('rejects a source without the canonical section', () => {
    expect(() => generateVueInjectionModuleAugmentation('')).toThrow(
      'Vue injection start marker not found'
    )
  })
})

function collectSignatures(source: string): Record<string, string[]> {
  const sourceFile = ts.createSourceFile(
    'vue-injection-types.d.ts',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  )
  const signatures: Record<string, string[]> = {}

  const visit = (node: ts.Node): void => {
    if (ts.isInterfaceDeclaration(node) && injectionInterfaceNames.has(node.name.text)) {
      signatures[node.name.text] = node.members.map(member =>
        member.getText(sourceFile).replace(/\s+/g, ' ').trim()
      )
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return signatures
}
