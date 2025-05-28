import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js"
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'


async function main() {
  let client: Client
  const baseUrl = 'http://localhost:5173/__mcp'

  try {
    const transport = new StreamableHTTPClientTransport(new URL(baseUrl))
    client = new Client(
      {
        name: 'vue-i18n-docs-client',
        version: '0.0.1'
      },
      {
        capabilities: {
          sampling: {}
        }
      }
    )
    await client.connect(transport)
    console.log('connected to server')
  } catch (error) {
    console.error('Failed to connect using Streamable HTTP transport:', error)

    console.log('Streamable HTTP connection failed, falling back to SSE transport')
    client = new Client({
      name: 'vue-i18n-docs-sse-client',
      version: '0.0.1'
    });
    const sseTransport = new SSEClientTransport(new URL(`${baseUrl}/sse`))
    await client.connect(sseTransport)
    console.log('Connected using SSE transport')
  }

  // List tools
  const tools = await client.listTools()
  console.log('list tools', tools)
}

main()
