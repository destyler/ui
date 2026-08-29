import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import { Steps, stepsAnatomy } from '../index'

const componentExports = Steps as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[steps] component', () => {
  it.each(stepsAnatomy.keys().filter(part => part !== 'progress'))('renders and exports the %s anatomy part', async (part) => {
    await render(Basic)
    expect(document.querySelector(`[data-scope="steps"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Steps.${exportName}`).toBeDefined()
  })

  it('exports Progress even when the basic fixture does not render it', () => {
    expect(componentExports.Progress).toBeDefined()
  })

  it('navigates forward, backward, and into completed content', async () => {
    await render(Basic)
    await expect.element(page.getByText('First - Contact Info')).toBeVisible()
    await userEvent.click(page.getByText('Next'))
    await expect.element(page.getByText('Second - Date & Time')).toBeVisible()
    await userEvent.click(page.getByText('Back'))
    await expect.element(page.getByText('First - Contact Info')).toBeVisible()
    await userEvent.click(page.getByText('Next'))
    await userEvent.click(page.getByText('Next'))
    await userEvent.click(page.getByText('Next'))
    await expect.element(page.getByText('Steps Complete - Thank you for filling out the form!')).toBeVisible()
  })

  it('supports navigation and reset through RootProvider', async () => {
    await render(RootProvider)
    await expect.element(page.getByText('First - Contact Info')).toBeVisible()
    await userEvent.click(page.getByText('Next'))
    await expect.element(page.getByText('Second - Date & Time')).toBeVisible()
    await userEvent.click(page.getByText('Reset'))
    await expect.element(page.getByText('First - Contact Info')).toBeVisible()
  })
})
