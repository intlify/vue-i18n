;['composable', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/fallback/component.html`
      )
    })

    test('initial rendering', async () => {
      await expect(page).toMatch('こんにちは、世界')
      await expect(page).toMatch(
        'Component1 locale messages: こんにちは、component1'
      )
      await expect(page).toMatch(
        'Fallback global locale messages: おはよう、世界！'
      )
    })
  })
})
