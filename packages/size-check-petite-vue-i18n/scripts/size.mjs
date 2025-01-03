import { brotliCompressSync, gzipSync } from 'node:zlib'
import { build } from 'vite'

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
  name: 'packages/size-check-petite-vue-i18n (petite-vue-i18n)',
  size,
  gzip,
  brotli
}
console.log(JSON.stringify(report))
