import { getText } from '../../helper'
describe(`bridge: number format component`, () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:8080/examples/bridge/composition/components/number-format.html`
    )
  })

  test('rendering', async () => {
    expect(await getText(page, '#app p.p1')).toMatch('100')
    expect(await getText(page, '#app p.p2')).toMatch('$100.00')
    expect(await getText(page, '#app p.p3')).toMatch('￥100')
    expect(await getText(page, '#app div.slot')).toMatch('€1,234.00')
  })
})
