const { setupWarningConsole } = require('../helper') // eslint-disable-line

;['composition', 'petite'].forEach(pattern => {
  describe(`${pattern}`, () => {
    const warnings = []
    beforeAll(async () => {
      setupWarningConsole(page, warnings)
      await page.goto(
        `http://localhost:8080/examples/${pattern}/fallback/option.html`
      )
    })

    test('warning', () => {
      // missing warning only!
      expect(warnings[0]).toEqual(
        `[intlify] Not found 'message.hello' key in 'ja' locale messages.`
      )
    })

    test('rendering', async () => {
      await expect(page).toMatch('hello, kazupon!')
    })
  })
})
