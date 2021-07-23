;['composition', 'petite', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/scope/global.html`
      )
    })

    test('initial rendering', async () => {
      await expect(page).toMatchElement('#app p', {
        text: 'こんにちは、世界！'
      })
      await expect(page).toMatchElement('#app div.child p', {
        text: 'こんにちは！'
      })
      await expect(page).toMatchElement('#app div.sub-child p', {
        text: 'こんにちは！'
      })
    })

    test('change locale', async () => {
      await expect(page).toSelect('#app select', 'en')
      await expect(page).toMatchElement('#app p', { text: 'hello world!' })
      await expect(page).toMatchElement('#app div.child p', { text: 'Hi !' })
      await expect(page).toMatchElement('#app div.sub-child p', {
        text: 'Hi !'
      })

      await expect(page).toSelect('#app div.sub-child select', 'ja')
      await expect(page).toMatchElement('#app p', {
        text: 'こんにちは、世界！'
      })
      await expect(page).toMatchElement('#app div.child p', {
        text: 'こんにちは！'
      })
      await expect(page).toMatchElement('#app div.sub-child p', {
        text: 'こんにちは！'
      })
    })
  })
})
