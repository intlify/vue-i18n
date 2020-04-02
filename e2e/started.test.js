;['composable', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(`http://localhost:8080/examples/${pattern}/started.html`)
    })

    test('initial rendering', async () => {
      await expect(page).toMatch('言語')
      await expect(page).toMatch('こんにちは、世界！')
    })

    test('change locale', async () => {
      await page.select('#app select', 'en')
      await expect(page).toMatch('Language')
      await expect(page).toMatch('hello world!')
    })
  })
})
