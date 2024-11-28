import { getText, url } from './helper'

describe('CVE-2024-52809', () => {
  beforeAll(async () => {
    await page.goto(url(`/e2e/hotfix/CVE-2024-52809.html`))
  })

  test('fix', async () => {
    expect(await getText(page, 'p')).toMatch('hello world!')
  })
})
