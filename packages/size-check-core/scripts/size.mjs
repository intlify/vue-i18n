import { brotliCompressSync, gzipSync } from 'node:zlib'
import { build } from 'vite' // eslint-disable-line import/namespace -- NOTE(kazupon): ignore for size check project

const generated = await build({
  logLevel: 'silent',
  build: {
    minify: true
  }
})
const bundled = generated.output[0].code

const size = bundled.length
const gzip = gzipSync(bundled).length
const brotli = brotliCompressSync(bundled).length

const report = {
  name: 'packages/size-check-core (@intlify/core)',
  size,
  gzip,
  brotli
}
console.log(JSON.stringify(report))
