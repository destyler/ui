import { expect, it, vi } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import serverHtml from './group-item-emissions.ssr.html?raw'
import { GroupEmissionsFixture } from './GroupEmissionsFixture'

it('renders the hydration fixture without firing change notifications on the server', async () => {
  expect(typeof document).toBe('undefined')
  const changed = vi.fn()
  const html = await renderToString(createSSRApp(GroupEmissionsFixture, { 'onCheckedChange': changed, 'onUpdate:checked': changed, 'onValueChange': changed }))
  expect(html).toBe(serverHtml)
  expect(html).toMatch(/<input[^>]* checked/)
  expect(changed).not.toHaveBeenCalled()
})
