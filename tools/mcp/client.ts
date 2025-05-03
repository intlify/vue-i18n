import { Client } from 'npm:@modelcontextprotocol/sdk@1.10.2/client/index.js'
import { StdioClientTransport } from 'npm:@modelcontextprotocol/sdk@1.10.2/client/stdio.js'

if (import.meta.main) {
  const transport = new StdioClientTransport({
    command: 'deno',
    args: ['server.ts']
  })

  const client = new Client(
    {
      name: 'vue-i18n-demo',
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

  // list propmpts
  const propmpts = await client.listPrompts()
  console.log('list propmpts', propmpts)

  // List resources
  const resources = await client.listResources()
  console.log('list resources', resources)

  // Read a resource
  const ret = await client.readResource({
    uri: 'i18n://docs-index'
  })
  console.log('read resource', ret)

  // List resourceTemplates
  const resourceTemplates = await client.listResourceTemplates()
  console.log('list resourceTemplates', resourceTemplates)

  // Read a resource
  const resource = await client.readResource({
    uri: 'greeting://kazupon'
  })
  console.log('read resource', resource)

  // List tools
  const tools = await client.listTools()
  console.log('list tools', tools)

  // Call a 'add' tool
  const result = await client.callTool({
    name: 'add',
    arguments: {
      a: 1,
      b: 2
    }
  })
  console.log('call add tool', result)
}
