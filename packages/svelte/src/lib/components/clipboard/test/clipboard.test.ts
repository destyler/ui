import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import RenderFn from '../examples/RenderFn.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import { Clipboard, clipboardAnatomy } from '../index'

const componentExports = Clipboard as unknown as Record<string, unknown>

describe('[clipboard] component', () => {
  it.each(clipboardAnatomy.keys())('renders and exports the %s anatomy part', async (part: string) => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(`[data-scope="clipboard"][data-part="${part}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Clipboard.${exportName}`).toBeDefined()
  })

  it.each([
    ['Basic', Basic],
    ['RenderFn', RenderFn],
    ['RootProvider', RootProvider],
  ] as const)('keeps the %s trigger text in the same span structure as React', async (_, component) => {
    const screen = await render(component)
    const trigger = screen.container.querySelector('[data-scope="clipboard"][data-part="trigger"]')
    expect(trigger?.querySelector('span')).toHaveTextContent('Copy')
  })

  it('keeps the RootProvider API button label consistent', async () => {
    const screen = await render(RootProvider)
    expect(screen.container.querySelector('button:not([data-scope])')).toHaveTextContent('Copy')
  })
})
