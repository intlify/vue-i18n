import { getText } from '../../helper'
describe(`bridge: datetime format component`, () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:8080/examples/bridge/composition/components/datetime-format.html`
    )
  })

  test('rendering', async () => {
    expect(await getText(page, '#app p.p1')).toMatch(
      /([1-9]|1[0-2])\/([1-9]|[12]\d|3[01])\/([12]\d{3})/
    )
    expect(await getText(page, '#app p.p2')).toMatch(
      /(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/([12]\d{3}), (0[0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9])\u202f(AM|PM)/
    )
    expect(await getText(page, '#app p.p3')).toMatch(
      /令和([1-9]|1[0-2])年([1-9]|1[0-2])月([1-9]|[1-3][0-9])日(月|火|水|木|金|土|日)曜日 (午前|午後)([0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) 協定世界時/
    )
    expect(await getText(page, '#app span.p4')).toMatch(
      /([1-9]|1[0-2])年([1-9]|1[0-2])月([1-9]|[1-3][0-9])日(月|火|水|木|金|土|日)曜日 (午前|午後)([0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) 協定世界時/
    )
  })
})
