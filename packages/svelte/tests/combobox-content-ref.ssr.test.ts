import { render } from 'svelte/server'
import { expect, it } from 'vitest'
import Fixture from './combobox-content-ref.fixture.svelte'

for (const child of [false, true]) {
  for (const undefinedRef of [false, true]) {
    it(`renders Combobox content without DOM or a ref, child=${child}, undefined=${undefinedRef}`, async () => {
      expect(typeof window).toBe('undefined')
      expect(typeof document).toBe('undefined')
      const html = render(Fixture, { props: { child, undefinedRef } }).body
      expect(html).toContain('data-testid="content"')
      expect(html).toContain('<output>none</output>')
      await expect(html).toMatchFileSnapshot(`./combobox-content-ref.${child ? 'child' : 'native'}.ssr.html`)
      expect(typeof document).toBe('undefined')
    })
  }
}
