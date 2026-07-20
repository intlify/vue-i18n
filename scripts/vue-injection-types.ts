const START_MARKER = '// --- VUE I18N INJECTION TYPES START --- //'
const END_MARKER = '// --- VUE I18N INJECTION TYPES END --- //'
const INJECTION_INTERFACES = ['ComponentCustomOptions', 'ComponentCustomProperties']

export function generateVueInjectionModuleAugmentation(source: string): string {
  const declarations = extractInjectionDeclarations(source)
  const interfaceNames = Array.from(
    declarations.matchAll(/^export interface ([\w$]+)/gm),
    match => match[1]
  )

  if (
    interfaceNames.length !== INJECTION_INTERFACES.length ||
    interfaceNames.some((name, index) => name !== INJECTION_INTERFACES[index])
  ) {
    throw new Error(
      `Vue injection declarations must contain only: ${INJECTION_INTERFACES.join(', ')}`
    )
  }

  const indentedDeclarations = declarations
    .split('\n')
    .map(line => (line ? `  ${line}` : line))
    .join('\n')

  return `declare module 'vue' {\n${indentedDeclarations}\n}`
}

function extractInjectionDeclarations(source: string): string {
  const start = source.indexOf(START_MARKER)
  if (start === -1) {
    throw new Error(`Vue injection start marker not found: ${START_MARKER}`)
  }

  const declarationsStart = start + START_MARKER.length
  const end = source.indexOf(END_MARKER, declarationsStart)
  if (end === -1) {
    throw new Error(`Vue injection end marker not found: ${END_MARKER}`)
  }

  const declarations = source.slice(declarationsStart, end).trim()
  if (!declarations) {
    throw new Error('Vue injection declarations are empty')
  }

  return declarations
}
