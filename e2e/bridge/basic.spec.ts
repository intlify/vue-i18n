import { getText } from '../helper'
;['composition', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/bridge/${pattern}/basic.html`
      )
    })

    test('initial rendering', async () => {
      expect(await getText(page, 'label')).toMatch('言語')
      expect(await getText(page, 'p')).toMatch('こんにちは、vue-i18n-bridge！')
    })

    test('change locale', async () => {
      await page.selectOption('#app select', 'en')
      expect(await getText(page, 'label')).toMatch('Language')
      expect(await getText(page, 'p')).toMatch('hello, vue-i18n-bridge!')
    })
  })
})
