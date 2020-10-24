const { setupWarningConsole } = require('../helper') // eslint-disable-line

;['composition'].forEach(pattern => {
  describe(`${pattern}`, () => {
    const warnings = []
    beforeAll(async () => {
      setupWarningConsole(page, warnings)
      await page.goto(
        `http://localhost:8080/examples/${pattern}/fallback/default-format.html`
      )
    })

    test('warning', () => {
      expect(warnings).toEqual([
        `[vue-i18n] Not found 'messages.hello' key in 'ja' locale messages.`,
        `[vue-i18n] Fall back to translate 'messages.hello' key with 'en' locale.`,
        `[vue-i18n] Not found 'messages.hello' key in 'en' locale messages.`,
        `[vue-i18n] Not found 'messages.hello' key in 'ja' locale messages.`,
        `[vue-i18n] Fall back to translate 'messages.hello' key with 'en' locale.`,
        `[vue-i18n] Not found 'messages.hello' key in 'en' locale messages.`,
        `[vue-i18n] Not found 'good morning, {name}!' key in 'ja' locale messages.`,
        `[vue-i18n] Fall back to translate 'good morning, {name}!' key with 'en' locale.`,
        `[vue-i18n] Not found 'good morning, {name}!' key in 'en' locale messages.`
      ])
    })

    test('rendering', async () => {
      await expect(page).toMatchElement('p:nth-child(1)', {
        text: 'hello, kazupon!'
      })
      await expect(page).toMatchElement('p:nth-child(2)', {
        text: 'hi, kazupon!'
      })
      await expect(page).toMatchElement('p:nth-child(3)', {
        text: 'good morning, kazupon!'
      })
    })
  })
})
