;['composable', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/scope/inherit-locale.html`
      )
    })

    test('initial rendering', async () => {
      await expect(page).toMatchElement('#app p', {
        text: 'こんにちは、世界！'
      })
      await expect(page).toMatchElement('#app div.child p', {
        text: 'こんにちは！'
      })
      await expect(page).toMatchElement('#app label[for=checkbox]', {
        text: 'root から locale を継承する'
      })
    })

    test('change locale', async () => {
      // root
      await expect(page).toSelect('#app select', 'en')
      await expect(page).toMatchElement('#app p', { text: 'hello world!' })
      await expect(page).toMatchElement('#app div.child p', { text: 'Hi !' })
      await expect(page).toMatchElement('#app label[for=checkbox]', {
        text: 'Inherit locale from root'
      })

      // Child
      await expect(page).toSelect('#app div.child select', 'ja')
      await expect(page).toMatchElement('#app p', { text: 'hello world!' })
      await expect(page).toMatchElement('#app div.child p', {
        text: 'こんにちは！'
      })
      await expect(page).toMatchElement('#app label[for=checkbox]', {
        text: 'root から locale を継承する'
      })

      // checkbox off
      await expect(page).toClick('#checkbox')
      await expect(page).toSelect('#app select', 'ja')
      await expect(page).toSelect('#app select', 'en')
      await expect(page).toMatchElement('#app p', { text: 'hello world!' })
      await expect(page).toMatchElement('#app div.child p', {
        text: 'こんにちは！'
      })
      await expect(page).toMatchElement('#app label[for=checkbox]', {
        text: 'root から locale を継承する'
      })

      // checkbox on
      await expect(page).toClick('#checkbox')
      await expect(page).toSelect('#app select', 'ja')
      await expect(page).toSelect('#app select', 'en')
      await expect(page).toMatchElement('#app p', { text: 'hello world!' })
      await expect(page).toMatchElement('#app div.child p', { text: 'Hi !' })
      await expect(page).toMatchElement('#app label[for=checkbox]', {
        text: 'Inherit locale from root'
      })
    })
  })
})
