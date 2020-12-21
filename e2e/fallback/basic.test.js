const { setupWarningConsole } = require('../helper') // eslint-disable-line

;['composition', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    const warnings = []
    beforeAll(async () => {
      setupWarningConsole(page, warnings)
      await page.goto(
        `http://localhost:8080/examples/${pattern}/fallback/basic.html`
      )
    })

    test('warning', () => {
      // missing warning
      expect(warnings[0]).toEqual(
        `[intlify] Not found 'message.hello' key in 'ja' locale messages.`
      )
      // fallback warning
      expect(warnings[1]).toEqual(
        `[intlify] Fall back to translate 'message.hello' key with 'en' locale.`
      )
    })

    test('rendering', async () => {
      await expect(page).toMatch('hello world!')
    })
  })
})
