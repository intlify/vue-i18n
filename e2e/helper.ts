import { JSDOM } from 'jsdom'

import type { Page } from 'playwright'

export function sleep(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

export async function getText(
  page: Page,
  selector: string,
  options?: Parameters<Page['locator']>[1]
) {
  return (await page.locator(selector, options).allTextContents())[0]
}

export async function getData(
  page: Page,
  selector: string,
  options?: Parameters<Page['locator']>[1]
) {
  return JSON.parse(await page.locator(selector, options).innerText())
}

export async function assetLocaleHead(page: Page, headSelector: string) {
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

export function getDom(html: string) {
  return new JSDOM(html).window.document
}

export function getDataFromDom(dom: Document, selector: string) {
  return JSON.parse(
    dom.querySelector(selector)!.textContent!.replace('&quot;', '"')
  )
}

export function assertLocaleHeadWithDom(dom: Document, headSelector: string) {
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
