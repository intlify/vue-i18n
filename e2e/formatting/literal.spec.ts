import { getText, url } from '../helper'
;['composition', 'petite', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(url(`/examples/${pattern}/formatting/literal.html`))
    })

    test('initial rendering', async () => {
      expect(await getText(page, '#app p')).toMatch('こんにちは、かずぽん！')
    })

    test('change locale', async () => {
      await page.selectOption('#app select', 'en')
      expect(await getText(page, '#app p')).toMatch('Hello, kazupon!')
    })
  })
})
