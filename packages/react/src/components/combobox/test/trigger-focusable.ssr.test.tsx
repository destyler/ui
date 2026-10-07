import { renderToString } from 'react-dom/server'
import { expect, it } from 'vitest'
import { createListCollection } from '~/utils/collection'
import { Combobox } from '../index'

const collection = createListCollection({ items: ['React', 'Svelte'] })
for (const asChild of [false, true]) {
  for (const focusable of [undefined, false, true]) {
    it(`renders trigger focusability without a DOM, asChild=${asChild}, focusable=${focusable}`, () => {
      expect(typeof document).toBe('undefined')
      const html = renderToString(
        <Combobox.Root collection={collection} id="trigger-ssr">
          <Combobox.Trigger focusable={focusable} asChild={asChild}>
            {asChild ? <button type="button">Open</button> : 'Open'}
          </Combobox.Trigger>
        </Combobox.Root>,
      )
      expect(html.includes('tabindex="-1"')).toBe(!focusable)
      expect(html.includes('data-focusable=""')).toBe(!!focusable)
      expect(html).not.toMatch(/\sfocusable=/)
      expect(typeof document).toBe('undefined')
    })
  }
}
