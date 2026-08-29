import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Customized from '../examples/Customized.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import { Pagination, paginationAnatomy } from '../index'

const componentExports = Pagination as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[pagination] component', () => {
  it.each(paginationAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(`[data-scope="pagination"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Pagination.${exportName}`).toBeDefined()
  })

  it('changes pages through items and controls', async () => {
    await render(Basic)
    const pageOne = page.getByLabelText('page 1', { exact: true })
    const pageTwo = page.getByLabelText('page 2')
    await expect.element(pageOne).toHaveAttribute('aria-current', 'page')
    await userEvent.click(pageTwo)
    await expect.element(pageTwo).toHaveAttribute('aria-current', 'page')
    await userEvent.click(page.getByText(/prev/i))
    await expect.element(pageOne).toHaveAttribute('aria-current', 'page')
    await userEvent.click(page.getByText(/next/i))
    await expect.element(pageTwo).toHaveAttribute('aria-current', 'page')
  })

  it('updates RootProvider state from an external control', async () => {
    await render(RootProvider)
    await userEvent.click(page.getByRole('button', { name: 'Next Page', exact: true }))
    await expect.element(page.getByLabelText('page 2')).toHaveAttribute('aria-current', 'page')
  })

  it.each([
    ['Basic', Basic],
    ['Customized', Customized],
    ['RootProvider', RootProvider],
  ] as const)('keeps both %s control suffixes visually hidden', async (_, component) => {
    const screen = await render(component)
    const suffixes = screen.container.querySelectorAll('span.visually-hidden')
    expect(suffixes).toHaveLength(2)
    for (const suffix of suffixes)
      expect(suffix).toHaveTextContent('Page')
  })
})
