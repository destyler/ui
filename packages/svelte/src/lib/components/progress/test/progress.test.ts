import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import CircularBasic from '../examples/circular/Basic.svelte'
import CircularControlled from '../examples/circular/Controlled.svelte'
import CircularIndeterminate from '../examples/circular/Indeterminate.svelte'
import CircularMinMax from '../examples/circular/MinMax.svelte'
import CircularRootProvider from '../examples/circular/RootProvider.svelte'
import LinearBasic from '../examples/linear/Basic.svelte'
import LinearControlled from '../examples/linear/Controlled.svelte'
import LinearIndeterminate from '../examples/linear/Indeterminate.svelte'
import LinearMinMax from '../examples/linear/MinMax.svelte'
import LinearRootProvider from '../examples/linear/RootProvider.svelte'
import { Progress, progressAnatomy } from '../index'

const componentExports = Progress as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[progress] component', () => {
  it.each(progressAnatomy.keys().filter(part => part !== 'view'))('renders and exports the %s anatomy part', async (part) => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(`[data-scope="progress"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Progress.${exportName}`).toBeDefined()
  })

  it('exports View', () => {
    expect(componentExports.View).toBeDefined()
  })

  it.each([
    ['circular basic', CircularBasic, '42%'],
    ['circular controlled', CircularControlled, '42%'],
    ['circular min/max', CircularMinMax, '50%'],
    ['linear basic', LinearBasic, '42%'],
    ['linear controlled', LinearControlled, '42%'],
    ['linear min/max', LinearMinMax, '50%'],
  ] as const)('renders %s value text', async (_, component, valueText) => {
    const screen = await render(component as typeof CircularBasic)
    await expect.element(screen.getByText('Label')).toBeVisible()
    await expect.element(screen.getByText(valueText)).toBeVisible()
  })

  it.each([
    ['circular', CircularIndeterminate],
    ['linear', LinearIndeterminate],
  ] as const)('marks %s progress as indeterminate', async (_, component) => {
    const screen = await render(component as typeof CircularIndeterminate)
    expect(screen.container.querySelector('[data-part="root"]')).toHaveAttribute('data-state', 'indeterminate')
  })

  it.each([
    ['circular', CircularRootProvider],
    ['linear', LinearRootProvider],
  ] as const)('updates %s progress through RootProvider', async (_, component) => {
    const screen = await render(component as typeof CircularRootProvider)
    await userEvent.click(screen.getByRole('button', { name: 'Set to MAX' }))
    await expect.element(screen.getByText('100%')).toBeVisible()
  })
})
