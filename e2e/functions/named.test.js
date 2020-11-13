;['composition', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/functions/named.html`
      )
    })

    test('initial rendering', async () => {
      await expect(page).toMatch('こんにちは、kazupon！')
    })

    test('change locale', async () => {
      await page.select('#app select', 'en')
      await expect(page).toMatch('Hello, kazupon!')
    })
  })
})
