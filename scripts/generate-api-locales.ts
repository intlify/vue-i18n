import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const docsApiDir = path.resolve(rootDir, 'docs/api')
const locales = ['zh', 'jp']
const generatedNames = ['general', 'vue', 'index.md', 'api-sidebar.json']

export async function syncApiDocsLocales() {
  try {
    await fs.access(docsApiDir)
  } catch {
    console.error(`Error: ${docsApiDir} does not exist. Please run 'pnpm docs:api' first.`)
    process.exit(1)
  }

  for (const locale of locales) {
    const targetDir = path.resolve(rootDir, `docs/${locale}/api`)
    console.log(`Syncing API docs to ${targetDir}...`)

    await fs.mkdir(targetDir, { recursive: true })

    for (const name of generatedNames) {
      await fs.rm(path.join(targetDir, name), { recursive: true, force: true })
    }
    await fs.rm(path.join(targetDir, 'typedoc-sidebar.json'), { force: true })

    const entries = await fs.readdir(docsApiDir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name === 'v11') continue

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

    const sidebarPath = path.resolve(targetDir, 'api-sidebar.json')
    if (await fs.stat(sidebarPath).catch(() => false)) {
      const content = await fs.readFile(sidebarPath, 'utf-8')
      const newContent = content.replace(/\/api\//g, `/${locale}/api/`)
      await fs.writeFile(sidebarPath, newContent)
      console.log(`Updated sidebar links for ${locale}`)
    }
  }

  console.log('Done.')
}

const isCli =
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isCli) {
  syncApiDocsLocales().catch(error => {
    console.error(error)
    process.exit(1)
  })
}
