import {
  McpServer,
  ResourceTemplate
} from 'npm:@modelcontextprotocol/sdk@1.10.2/server/mcp.js'
import { StdioServerTransport } from 'npm:@modelcontextprotocol/sdk@1.10.2/server/stdio.js'
import { z } from 'npm:zod@3.24.3'

if (import.meta.main) {
  const server = new McpServer({
    name: 'vue-i18n-demo',
    version: '0.0.1'
  })

  // Add an addition tool
  server.tool('add', { a: z.number(), b: z.number() }, async ({ a, b }) => ({
    content: [{ type: 'text', text: String(a + b) }]
  }))

  server.resource('docs-index', 'i18n://docs-index', async uri => {
    return {
      contents: [
        {
          uri: uri.href,
          text: 'Hello, world!'
        }
      ]
    }
  })

  // Add a dynamic greeting resource
  server.resource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    async (uri, { name }) => ({
      contents: [
        {
          uri: uri.href,
          text: `Hello, ${name}!`
        }
      ]
    })
  )

  server.prompt('review-code', { code: z.string() }, ({ code }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Please review this code:\n\n${code}`
        }
      }
    ]
  }))

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport()
  await server.connect(transport)
}
