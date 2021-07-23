const { setupWarningConsole } = require('../helper') // eslint-disable-line

;['composition', 'petite', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    const warnings = []
    beforeAll(async () => {
      setupWarningConsole(page, warnings)
      await page.goto(
        `http://localhost:8080/examples/${pattern}/missing/handler.html`
      )
    })

    test('warning', () => {
      // missing handler warning
      expect(warnings[0]).toEqual(`detect 'message.hello' key missing in 'ja'`)
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
