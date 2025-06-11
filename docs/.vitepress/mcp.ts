import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { ViteDevServer } from 'vite'
import type { DefaultTheme, SiteConfig, SiteData } from 'vitepress'

type Awaitable<T> = T | PromiseLike<T>;

export default async function mcp(mcpServer: McpServer, viteServer: ViteDevServer): Awaitable<void | McpServer> {
  const vitepress = (viteServer.config as any).vitepress as SiteConfig
  const docRootDir = vitepress.srcDir
  const docFiles = (vitepress.pages || []).map(page => path.resolve(docRootDir, page)).filter(file => existsSync(file))
  console.log('VitePress pages:', docFiles)
  const themeConfig = vitepress.site.themeConfig as DefaultTheme.Config
  console.log('VitePress site config:', vitepress)
  // console.log('Setting up MCP server for Vue I18n docs...', themeConfig.sidebar)
  const sidebarDirs = await getSidebarDirNames(docRootDir)
  console.log('Sidebar:', themeConfig.sidebar, sidebarDirs)
  // for (const [key, value] of Object.entries(themeConfig.sidebar || {})) {
  //   console.log(`Sidebar item: ${key}`)
  //   const items = (themeConfig.sidebar || {})[key] as DefaultTheme.SidebarItem[]
  //   for (const item of items) {
  //     console.log(item.text, item)
  //   }
  // }

  // @ts-expect-error -- FIXME:
  mcpServer.resource('contents', 'vue-i18n://docs', {
    uri: 'vue-i18n://docs',
    name: 'Vue I18n Documentation top',
    description: 'Vue I18n documentation root, provides categories and links to documentation pages.',
  }, async (uri) => {
    const content = renderMarkdownTop(vitepress.site, getSideBar(sidebarDirs, themeConfig.sidebar || {}))
    return {
      contents: [
        {
          uri,
          text: content,
        }
      ]
    }
  })

  const pageUri = 'vue-i18n://docs{page}'
  const pageTempalte = new ResourceTemplate(pageUri, { list: undefined })
  mcpServer.resource('pages', pageTempalte, {
    uri: pageUri,
    name: 'Vue I18n Documentation page',
    description: 'Vue I18n documentation page content',
  }, async (uri, params) => {
    console.log('Fetching page:', uri, params)
    const p = Array.isArray(params.page) ? params.page[0] : params.page
    const pagePath = path.resolve(docRootDir, p)
    const file = await fs.readFile(pagePath, 'utf-8')
    return {
      contents: [{
        uri: uri.href,
        text: file,
      }]
    }
  })

  return mcpServer
}

function renderMarkdownTop(site: SiteData, sidebar: ReturnType<typeof getSideBar>) {
  return `# ${site.title}

${site.description}

## Table of Contents

${Object.entries(sidebar).map(([_caegory, items]) => {
    const buf = [] as string[]
    items.reduce((acc, item) => {
      acc.push(`### ${item.text}`, '')
      const items = (item.items || []) as DefaultTheme.SidebarItem[]
      const itemBuf = [] as string[]
      for (const subItem of items) {
        if (subItem.link) {
          itemBuf.push(`- [${subItem.text}](${subItem.link.endsWith('.md') ? subItem.link : `${subItem.link}.md`})`)
        }
      }
      itemBuf.push('')

      if (itemBuf.length) {
        acc.push(itemBuf.join('\n'))
      }
      return acc
    }, buf)
    return buf.join('\n')
  }).join('\n\n')
    }
`
}

function getSideBar(sidebarDirs: string[], sideBar: DefaultTheme.Sidebar) {
  return Object.keys(sideBar).reduce((acc, key) => {
    const category = key.split('/').filter(Boolean)[0]
    if (sidebarDirs.includes(category)) {
      acc[category] = sideBar[key] || []
    }
    return acc
  }, {} as { [key: string]: DefaultTheme.SidebarItem[] })
}

const EXCLUDE_DIR_NAMES = [
  '.vitepress',
  'index.md',
  'public',
]

async function getSidebarDirNames(root: string): Promise<string[]> {
  const dirs = await fs.readdir(root, { withFileTypes: true });
  return dirs.reduce((acc, dir) => {
    if (dir.isDirectory() && !EXCLUDE_DIR_NAMES.includes(dir.name)) {
      acc.push(dir.name)
    }
    return acc
  }, [] as string[])
}
