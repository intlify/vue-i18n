;['composable', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/components/number-format.html`
      )
    })

    test('rendering', async () => {
      await expect(page).toMatch('100')
      await expect(page).toMatch('$100.00')
      await expect(page).toMatch('￥100')
      await expect(page).toMatch('€1,234.00')
    })
  })
})
