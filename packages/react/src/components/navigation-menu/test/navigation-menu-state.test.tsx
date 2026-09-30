import type { Root } from 'react-dom/client'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { NavigationMenu, useNavigationMenu } from '../index'

const roots: Root[] = []
beforeEach(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
afterEach(async () => {
  for (const root of roots.splice(0))
    await act(async () => root.unmount())
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

for (const entry of ['Root', 'RootProvider', 'hook']) {
  it(`${entry}: null overrides a default seed in the mounted API and every part`, async () => {
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    roots.push(root)
    const onValueChange = vi.fn()
    let api: ReturnType<typeof useNavigationMenu>
    function capture(value: typeof api) {
      api = value
      return <output data-value={String(value.value)} data-open={String(value.open)} />
    }
    function Parts() {
      return <><NavigationMenu.List><NavigationMenu.Item value="one"><NavigationMenu.Trigger value="one">One</NavigationMenu.Trigger></NavigationMenu.Item></NavigationMenu.List><NavigationMenu.Content value="one">Content</NavigationMenu.Content><NavigationMenu.ViewportPositioner /></>
    }
    function HookFixture(props: NavigationMenu.RootProps) {
      'use no memo'
      const value = useNavigationMenu(props)
      if (entry === 'RootProvider')
        return <NavigationMenu.RootProvider value={value}><Parts />{capture(value)}</NavigationMenu.RootProvider>
      return (
        <nav {...value.getRootProps()}>
          <button {...value.getTriggerProps({ value: 'one' })}>One</button>
          <div {...value.getContentProps({ value: 'one' })}>Content</div>
          <div {...value.getViewportPositionerProps()} />
          {capture(value)}
        </nav>
      )
    }
    async function render(value: string | null) {
      const props = { value, defaultValue: 'one', disableHoverTrigger: true, onValueChange }
      await act(async () => root.render(entry === 'Root'
        ? <NavigationMenu.Root {...props}><Parts /><NavigationMenu.Context>{capture}</NavigationMenu.Context></NavigationMenu.Root>
        : <HookFixture {...props} />))
    }
    function assertState(value: string | null) {
      const open = value !== null
      expect(api.value).toBe(value)
      expect(api.open).toBe(open)
      expect(container.querySelector('output')?.dataset).toMatchObject({ value: String(value), open: String(open) })
      expect(container.querySelector('[data-part="trigger"]')?.getAttribute('aria-expanded')).toBe(String(open))
      const content = container.querySelector<HTMLElement>('[data-part="content"]')!
      expect(content.getAttribute('data-state')).toBe(open ? 'open' : 'closed')
      expect(content.hidden).toBe(!open)
      expect(container.querySelector('[data-part="viewport-positioner"]')?.getAttribute('data-state')).toBe(open ? 'open' : 'closed')
      expect(api.getViewportPositionerProps()).toMatchObject({ 'data-state': open ? 'open' : 'closed' })
    }
    await render(null)
    assertState(null)
    for (let index = 0; index < 2; index++) {
      await act(async () => container.querySelector<HTMLButtonElement>('button')!.click())
      assertState(null)
    }
    expect(onValueChange.mock.calls).toEqual([[{ value: 'one' }], [{ value: 'one' }]])
    for (const value of ['one', null, 'one', null]) {
      await render(value)
      assertState(value)
    }
  })
}
