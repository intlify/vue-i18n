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
