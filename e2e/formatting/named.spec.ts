import { getText } from '../helper'
;['composition', 'petite', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/formatting/named.html`
      )
    })

    test('initial rendering', async () => {
      expect(await getText(page, '#app p')).toMatch('こんにちは、kazupon！')
    })

    test('change locale', async () => {
      await page.selectOption('#app select', 'en')
      expect(await getText(page, '#app p')).toMatch('Hello, kazupon!')
    })
  })
})
