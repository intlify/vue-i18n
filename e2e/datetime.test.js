;['composable', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(`http://localhost:8080/examples/${pattern}/datetime.html`)
    })

    test('initial rendering', async () => {
      await expect(page).toMatch('現在の日時')
      await expect(page).toMatch(
        /([12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])) (午前|午後)(0[0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9])/
      )
    })

    test('change locale', async () => {
      await page.select('#app select', 'en')
      await expect(page).toMatch('Current Datetime')
      await expect(page).toMatch(
        /(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/([12]\d{3}), (0[0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) (AM|PM)/
      )
    })
  })
})
