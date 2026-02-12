import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const docsApiDir = path.resolve(rootDir, 'docs/api')
const locales = ['zh', 'jp']

async function main() {
  // Check if docs/api exists
  try {
    await fs.access(docsApiDir)
  } catch {
    console.error(`Error: ${docsApiDir} does not exist. Please run 'pnpm typedoc' first.`)
    process.exit(1)
  }

  for (const locale of locales) {
    const targetDir = path.resolve(rootDir, `docs/${locale}/api`)
    console.log(`Syncing TypeDoc to ${targetDir}...`)

    // Ensure target dir exists
    await fs.mkdir(targetDir, { recursive: true })

    // Copy files recursively
    // We only copy generated typedoc content, excluding v11 (which is manual)
    const entries = await fs.readdir(docsApiDir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name === 'v11') continue // Skip v11 as it is manually managed/translated

      const srcPath = path.join(docsApiDir, entry.name)
      const destPath = path.join(targetDir, entry.name)

      if (entry.isDirectory()) {
        console.log(`Copying directory: ${entry.name}`)
        await fs.cp(srcPath, destPath, { recursive: true, force: true })
      } else {
        console.log(`Copying file: ${entry.name}`)
        await fs.copyFile(srcPath, destPath)
      }
    }

    // Update sidebar json
    const sidebarPath = path.resolve(targetDir, 'typedoc-sidebar.json')
    if (await fs.stat(sidebarPath).catch(() => false)) {
      const content = await fs.readFile(sidebarPath, 'utf-8')
      // Replace /api/ with /<locale>/api/
      const newContent = content.replace(/\/api\//g, `/${locale}/api/`)
      await fs.writeFile(sidebarPath, newContent)
      console.log(`Updated sidebar links for ${locale}`)
    }
  }

  console.log('Done.')
}

main().catch(console.error)
