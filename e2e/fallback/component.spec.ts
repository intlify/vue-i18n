import { getText } from '../helper'
;['composition', 'petite', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/fallback/component.html`
      )
    })

    test('initial rendering', async () => {
      expect(await getText(page, '#app p.root')).toMatch('こんにちは、世界')
      expect(await getText(page, '#app p.c1')).toMatch(
        'Component1 locale messages: こんにちは、component1'
      )
      expect(await getText(page, '#app p.c2')).toMatch(
        'Fallback global locale messages: おはよう、世界！'
      )
    })
  })
})
