export function isAllowedDiagnostic(message: string): boolean
export function normalizeGeneratedFiles(files: Record<string, string>): Record<string, string>
export function collectGeneratedSymbolNames(files: Record<string, string>): string[]
export function removeModulesSection(content: string): string
export function generateApiDocs(): Promise<{
  files: Record<string, string>
  nav: unknown[]
  diagnostics: string[]
  outDir: string
}>
