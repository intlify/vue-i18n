import { getText } from './helper'
;['composition', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(`http://localhost:8080/examples/${pattern}/number.html`)
    })

    test('initial rendering', async () => {
      expect(await getText(page, 'p')).toMatch('お金: ￥1,000')
    })

    test('change locale', async () => {
      await page.selectOption('#app select', 'en-US')
      expect(await getText(page, 'p')).toMatch('Money: $1,000.00')
    })
  })
})
