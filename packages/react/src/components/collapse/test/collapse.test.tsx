import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { LocaleProvider } from '~/providers'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Collapse, collapseAnatomy } from '../index'

describe('[collapse] parts & exports', () => {
  it.each(getParts(collapseAnatomy))('should render part %s', (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(collapseAnatomy))('should export %s', (part) => {
    render(<Basic />)
    expect(Collapse[part]).toBeDefined()
  })
})

describe('[collapse] components', () => {
  it('should not have an expanded item by default', async () => {
    render(<Basic />)

    await expect.element(page.getByRole('button', { name: 'React Trigger' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('should open item specified in defaultValue', async () => {
    render(<Basic defaultValue={['Solid']} />)

    await expect.element(page.getByRole('button', { name: 'Solid Trigger' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('should collapse an expanded item when collapsible is true', async () => {
    render(<Basic collapsible />)

    const button = page.getByRole('button', { name: 'React Trigger' })

    await userEvent.click(button)

    await expect.element(button).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(button)

    await expect.element(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('should disable a single item', async () => {
    render(<Basic />)

    await expect.element(page.getByRole('button', { name: 'Svelte Trigger' })).toBeDisabled()
  })

  it('should disable all items when disabled is true', async () => {
    render(<Basic disabled />)

    await expect.element(page.getByRole('button', { name: 'React Trigger' })).toBeDisabled()
    await expect.element(page.getByRole('button', { name: 'Solid Trigger' })).toBeDisabled()
    await expect.element(page.getByRole('button', { name: 'Svelte Trigger' })).toBeDisabled()
    await expect.element(page.getByRole('button', { name: 'Vue Trigger' })).toBeDisabled()
  })

  it('should allow multiple items to be expanded when multiple is true', async () => {
    render(<Basic multiple />)

    const reactButton = page.getByRole('button', { name: 'React Trigger' })
    const vueButton = page.getByRole('button', { name: 'Vue Trigger' })

    await userEvent.click(reactButton)
    await userEvent.click(vueButton)

    await expect.element(reactButton).toHaveAttribute('aria-expanded', 'true')
    await expect.element(vueButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('should call onValueChange when an item is clicked', async () => {
    const onValueChange = vi.fn()
    render(<Basic onValueChange={onValueChange} />)

    const button = page.getByRole('button', { name: 'React Trigger' })

    await userEvent.click(button)
    expect(onValueChange).toHaveBeenCalled()
  })

  it('should render text direction based on dir prop', async () => {
    render(
      <LocaleProvider locale="ar-AE">
        <Basic />
      </LocaleProvider>,
    )

    const button = page.getByRole('button', { name: 'React Trigger' })
    await expect.element(button).toHaveAttribute('dir', 'rtl')
  })

  it('should focus the next/previous item on arrow up & down', async () => {
    render(<Basic />)

    const firstButton = page.getByRole('button', { name: 'React Trigger' })
    const secondButton = page.getByRole('button', { name: 'Solid Trigger' })

    await userEvent.click(firstButton)

    await userEvent.type(firstButton, '{arrowdown}')
    await expect.element(secondButton).toHaveFocus()

    await userEvent.type(secondButton, '{arrowup}')
    await expect.element(firstButton).toHaveFocus()
  })

  it('should focus the first/last item on home & end', async () => {
    render(<Basic />)

    const firstButton = page.getByRole('button', { name: 'React Trigger' })
    const lastButton = page.getByRole('button', { name: 'Vue Trigger' })

    await userEvent.click(lastButton)

    await userEvent.type(lastButton, '{home}')
    await expect.element(firstButton).toHaveFocus()

    await userEvent.type(firstButton, '{end}')
    await expect.element(lastButton).toHaveFocus()
  })

  it('should not collapse the current visible item', async () => {
    render(<Basic collapsible={false} />)

    const button = page.getByRole('button', { name: 'React Trigger' })

    await userEvent.click(button)
    await expect.element(button).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(button)
    await expect.element(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('should move the focus to the next element when pressing tab', async () => {
    render(<Basic />)

    const firstButton = page.getByRole('button', { name: 'React Trigger' })
    const secondButton = page.getByRole('button', { name: 'Solid Trigger' })

    await userEvent.click(firstButton)

    await userEvent.type(firstButton, '{tab}')
    await expect.element(secondButton).toHaveFocus()
  })

  it('should lazy mount an collapse item', async () => {
    render(<Basic lazyMount collapsible />)

    const button = page.getByRole('button', { name: 'React Trigger' })

    await expect.element(page.getByText('React Content')).not.toBeInTheDocument()
    await userEvent.click(button)

    await expect.element(page.getByText('React Content')).toBeVisible()
    await userEvent.click(button)

    await vi.waitFor(async () => await expect.element(page.getByText('React Content')).not.toBeVisible())
  })

  it('should not have aria-controls if lazy mounted', async () => {
    render(<Basic lazyMount />)

    const button = page.getByRole('button', { name: 'React Trigger' })

    await expect.element(button).not.toHaveAttribute('aria-controls')

    await userEvent.click(button)
    await expect.element(button).toHaveAttribute('aria-controls')
  })

  it('should lazy mount and unmount on exit an collapse item', async () => {
    render(<Basic lazyMount unmountOnExit collapsible />)

    const button = page.getByRole('button', { name: 'React Trigger' })

    await expect.element(page.getByText('React Content')).not.toBeInTheDocument()
    await userEvent.click(button)

    await expect.element(page.getByText('React Content')).toBeVisible()

    await userEvent.click(button)
    await vi.waitFor(async () => await expect.element(page.getByText('React Content')).not.toBeInTheDocument())
  })
})
