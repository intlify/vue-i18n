;['composition', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.emulateTimezone('UTC')
      await page.goto(
        `http://localhost:8080/examples/${pattern}/components/datetime-format.html`
      )
    })

    test('rendering', async () => {
      await expect(page).toMatch(
        /([1-9]|1[0-2])\/([1-9]|[12]\d|3[01])\/([12]\d{3})/
      )
      await expect(page).toMatch(
        /(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/([12]\d{3}), (0[0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) (AM|PM)/
      )
      await expect(page).toMatch(
        /令和([1-9]|1[0-2])年([1-9]|1[0-2])月([1-9]|[1-3][0-9])日(月|火|水|木|金|土|日)曜日 (午前|午後)([0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) 協定世界時/
      )
      await expect(page).toMatch(
        /R([1-9]|1[0-2])年([1-9]|1[0-2])月([1-9]|[1-3][0-9])日(月|火|水|木|金|土|日)曜日 (午前|午後)([0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) 協定世界時/
      )
    })
  })
})
