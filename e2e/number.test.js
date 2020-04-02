;['composable', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(`http://localhost:8080/examples/${pattern}/number.html`)
    })

    test('initial rendering', async () => {
      await expect(page).toMatch('お金')
      await expect(page).toMatch('￥1,000')
    })

    test('change locale', async () => {
      await page.select('#app select', 'en')
      await expect(page).toMatch('Money')
      await expect(page).toMatch('$1,000.00')
    })
  })
})
