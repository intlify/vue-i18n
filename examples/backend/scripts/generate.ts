import { promises as fs } from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'
import { $fetch } from 'ofetch'
import { generateJSON } from '@intlify/bundle-utils'
import { locales } from '../src/constants'

import type { Locale } from 'vue-i18n'
import type { ResourceSchema } from '../db/message'

async function compile(locale: string, message: ResourceSchema) {
  const filename = path.join(__dirname, `../public/${locale}.js`)
  const ret = generateJSON(JSON.stringify(message), {
    type: 'plain',
    filename,
    env: 'production',
    onError(msg) {
      console.error('compile error', msg)
    },
    onWarn(msg) {
      console.warn('compile waring', msg)
    }
  })
  return { ...ret, filename }
}

;(async (locales: readonly Locale[]) => {
  // start vite server
  const vite = await createServer({ root: process.cwd() })
  await vite.listen(3000)
  vite.printUrls()

  // compile reousrces
  for (const locale of locales) {
    const resource = await $fetch<ResourceSchema>(
      `http://localhost:3000/api/resources/${locale}`
    )
    const { code, filename } = await compile(locale, resource)
    await fs.writeFile(filename, code)
  }

  process.on('uncaughtException', err => {
    console.error(`uncaught exception: ${err}\n`)
    process.exit(1)
  })

  process.on('unhandledRejection', (reason, p) => {
    console.error('unhandled rejection at:', p, 'reason:', reason)
    process.exit(1)
  })

  process.exit(0)
})(locales)
