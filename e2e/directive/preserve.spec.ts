import { getText, sleep } from '../helper'
;['composition', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/directive/preserve.html`
      )
    })

    test('initial rendering', async () => {
      expect(await getText(page, '#app p')).toMatch('hi there!')
    })

    test('trigger transition', async () => {
      await page.click('#app button')
      expect(await getText(page, '#app p')).toMatch('hi there!')
      await sleep(1000)
      await page.click('#app button')
      expect(await getText(page, '#app p')).toMatch('hi there!')
    })
  })
})
