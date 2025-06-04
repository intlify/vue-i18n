import fs from 'node:fs/promises'
import path from 'node:path'

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { ViteDevServer } from 'vite'
import type { SiteConfig } from 'vitepress'

type Awaitable<T> = T | PromiseLike<T>;

export default function mcp(mcpServer: McpServer, viteServer: ViteDevServer): Awaitable<void | McpServer> {
  const vitepress = (viteServer.config as any).vitepress as SiteConfig
  console.log('Setting up MCP server for Vue I18n docs...', vitepress.userConfig.themeConfig)
  // mcpServer.resource('contents', 'vue-i18n://contents', async (uri) => {
  mcpServer.resource('contents', 'vue-i18n://contents', {
    uri: 'vue-i18n://contents',
    name: 'Vue I18n Contents',
    description: 'List of Contents for Vue I18n',
  }, async (uri) => {
    const filePath = path.resolve(import.meta.dirname, './dist/llms.txt')
    const content = await fs.readFile(filePath, 'utf-8')
    return {
      contents: [
        {
          uri,
          text: content,
        }
      ]
    }
  })
  return mcpServer
}
