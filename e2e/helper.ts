import { JSDOM } from 'jsdom'
import { useTestContext } from '../scripts/test-utils'

import type { Page } from 'playwright-core'

export function sleep(delay: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delay))
}

export async function getText(
  page: Page,
  selector: string,
  options?: Parameters<Page['locator']>[1]
): Promise<string> {
  return (await page.locator(selector, options).allTextContents())[0]
}

export async function getData(
  page: Page,
  selector: string,
  options?: Parameters<Page['locator']>[1]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  return JSON.parse(await page.locator(selector, options).innerText())
}

export async function assetLocaleHead(page: Page, headSelector: string): Promise<void> {
  const localeHeadValue = await getData(page, headSelector)
  const headHandle = await page.locator('head').elementHandle()
  await page.evaluateHandle(
    ([headTag, localeHead]) => {
      const headData = [...localeHead.link, ...localeHead.meta]
      for (const head of headData) {
        const tag = headTag.querySelector(`[id="${head.id}"]`)
        for (const [key, value] of Object.entries(head)) {
          if (key === 'id') {
            continue
          }
          const v = tag.getAttribute(key)
          if (v !== value) {
            throw new Error(`${key} ${v} !== ${value}`)
          }
        }
      }
    },
    [headHandle, localeHeadValue]
  )
  await headHandle?.dispose()
}

export function getDom(html: string): Document {
  return new JSDOM(html).window.document
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDataFromDom(dom: Document, selector: string): any {
  return JSON.parse(dom.querySelector(selector)!.textContent!.replace('&quot;', '"'))
}

export function assertLocaleHeadWithDom(dom: Document, headSelector: string): void {
  const localeHead = getDataFromDom(dom, headSelector)
  const headData = [...localeHead.link, ...localeHead.meta]
  for (const head of headData) {
    const tag = dom.querySelector(`[id="${head.id}"]`)
    for (const [key, value] of Object.entries(head)) {
      if (key === 'id') {
        continue
      }

      const v = tag!.getAttribute(key)
      if (v !== value) {
        throw new Error(`${key} ${v} !== ${value}`)
      }
    }
  }
}

export function url(path: string): string {
  // eslint-disable-next-line vue-composable/composable-placement -- NOTE(kazupon): not a composable
  const ctx = useTestContext()

  if (!ctx.url) {
    throw new Error('url is not available (is server option enabled?)')
  }

  if (path.startsWith(ctx.url)) {
    return path
  }

  return ctx.url + path
}
