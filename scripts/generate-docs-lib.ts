/**
 * Helpers for API docs generation. Kept free of vitepress-api-references so
 * unit typecheck does not pull VitePress/Vue JSX types into the library program.
 *
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

export function isAllowedDiagnostic(message: string): boolean {
  return message.includes('was excluded from docs because it is marked @internal')
}

export function normalizeGeneratedFiles(files: Record<string, string>): Record<string, string> {
  const sourceModuleFiles = new Set(
    Object.keys(files).filter(filePath => filePath.includes('/modules/'))
  )
  const linkReplacements = createModuleLinkReplacements(files)
  const normalized: Record<string, string> = {}

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

function createModuleLinkReplacements(files: Record<string, string>): Map<string, string> {
  const replacements = new Map<string, string>()

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

function replaceModuleLinks(content: string, replacements: Map<string, string>): string {
  let next = content
  for (const [from, to] of replacements) {
    next = next.replaceAll(from, to)
  }
  return next
}

export function removeModulesSection(content: string): string {
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

interface OverloadParam {
  name: string
  optional?: boolean
}

interface OverloadMember {
  name: string
  kind: string
  type?: string
  params?: OverloadParam[]
}

interface OverloadEntry {
  name: string
  members?: OverloadMember[]
}

function formatCall(name: string, params: OverloadParam[] = []): string {
  return `${name}(${params.map(p => `${p.name}${p.optional ? '?' : ''}`).join(', ')})`
}

function replaceHeadings(content: string, heading: string, labels: string[]): string {
  let index = 0
  return content
    .split('\n')
    .map(line =>
      line === heading && index < labels.length
        ? `${heading.split(' ')[0]} ${labels[index++]}`
        : line
    )
    .join('\n')
}

/**
 * Name the overloads in the headings, so that the page outline lists the call forms:
 * `## Call Signature` becomes `## t(key, plural)`, and `### $t()` becomes `### $t(key, plural)`.
 */
export function labelOverloadHeadings(
  files: Record<string, string>,
  modules: { entries: OverloadEntry[] }[]
): Record<string, string> {
  const entries = modules.flatMap(module => module.entries)
  // `t: ComposerTranslation<...>` of Composer says how the interface is called
  const callNames = new Map<string, string>()
  for (const member of entries.find(entry => entry.name === 'Composer')?.members ?? []) {
    const typeName = member.kind === 'property' ? member.type?.match(/^\w+/)?.[0] : undefined
    if (typeName) {
      callNames.set(typeName, member.name)
    }
  }

  const labeled = { ...files }
  for (const entry of entries) {
    const filePath = Object.keys(files).find(file => file.endsWith(`/interfaces/${entry.name}.md`))
    if (!filePath) {
      continue
    }
    const members = entry.members ?? []
    const signatures = members.filter(member => member.kind === 'callSignature')
    const callName = callNames.get(entry.name)
    if (callName && signatures.length > 1) {
      labeled[filePath] = replaceHeadings(
        labeled[filePath],
        '## Call Signature',
        signatures.map(signature => formatCall(callName, signature.params))
      )
    }
    const methods = new Map<string, OverloadMember[]>()
    for (const member of members.filter(member => member.kind === 'method')) {
      methods.set(member.name, [...(methods.get(member.name) ?? []), member])
    }
    for (const [name, overloads] of methods) {
      if (overloads.length > 1) {
        labeled[filePath] = replaceHeadings(
          labeled[filePath],
          `### ${name}()`,
          overloads.map(overload => formatCall(name, overload.params))
        )
      }
    }
  }
  return labeled
}
