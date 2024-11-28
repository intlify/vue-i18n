import { getText, url } from '../helper'
;['composition', 'petite', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(url(`/examples/${pattern}/formatting/linked.html`))
    })

    test('initial rendering', async () => {
      expect(await getText(page, '#app p.linked')).toMatch(
        'DIO: the world !!!!'
      )
      expect(await getText(page, '#app p.error')).toMatch(
        'Please provide home address'
      )
      expect(await getText(page, '#app p.modifier')).toMatch(
        'custom modifiers example: snake-case'
      )
    })

    test('change locale', async () => {
      await page.selectOption('#app select', 'ja')
      expect(await getText(page, '#app p.linked')).toMatch(
        'ディオ: ザ・ワールド ！！！！'
      )
      expect(await getText(page, '#app p.error')).toMatch(
        'どうか、ホームアドレス を提供してください。'
      )
      expect(await getText(page, '#app p.modifier')).toMatch(
        'カスタム修飾子の例: スネーク-ケース'
      )
    })
  })
})
