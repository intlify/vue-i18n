// Pre-render the app into static HTML.
// run `npm run generate` and then `dist/static` can be served as a static site.

import fs from 'node:fs'
import path from 'node:path'
import { render } from './dist/server/entry-server.js'
import manifest from './dist/static/.vite/ssr-manifest.json' with { type: 'json' }

const toAbsolute = p => path.resolve(import.meta.dirname, p)
const template = fs.readFileSync(toAbsolute('dist/static/index.html'), 'utf-8')

// determine routes to pre-render from src/pages
const routesToPrerender = fs.readdirSync(toAbsolute('src/pages')).map(file => {
  const name = file.replace(/\.vue$/, '').toLowerCase()
  return name === 'home' ? `/` : `/${name}`
})

async function main() {
  // pre-render each route...
  for (const url of routesToPrerender) {
    const [appHtml, preloadLinks] = await render(url, manifest)

    const html = template
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--app-html-->`, appHtml)

    const filePath = `dist/static${url === '/' ? '/index' : url}.html`
    fs.writeFileSync(toAbsolute(filePath), html)
    console.log('pre-rendered:', filePath)
  }

  // done, delete ssr manifest
  fs.unlinkSync(toAbsolute('dist/static/ssr-manifest.json'))
}

await main()
