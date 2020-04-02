;['composable', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(`http://localhost:8080/examples/${pattern}/global.html`)
    })

    test('initial rendering', async () => {
      await expect(page).toMatch('こんにちは、世界！')
      await expect(page).toMatch('こんにちは！')
    })

    test('change locale', async () => {
      await page.select('#app select', 'en')
      await expect(page).toMatch('hello world!')
      await expect(page).toMatch('Hi !')
    })
  })
})
