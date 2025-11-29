import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import Collapsible from '../examples/Collapsible.vue'
import Controlled from '../examples/Controlled.vue'
import Disabled from '../examples/Disabled.vue'
import Multiple from '../examples/Multiple.vue'
import { Collapse, collapseAnatomy } from '../index'

describe('[collapse] component', () => {
  it.each(getParts(collapseAnatomy))('should render part %s', async (part) => {
    render(Basic)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(collapseAnatomy))('should export %s', async (part) => {
    render(Basic)
    expect(Collapse[part]).toBeDefined()
  })

  it('should not have an expanded item by default', async () => {
    render(Basic)
    await expect.element(page.getByRole('button', { name: 'React trigger' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('should open item specified in defaultValue', async () => {
    render(Controlled)
    await expect.element(page.getByRole('button', { name: 'Vue trigger' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('should collapse an expanded item when collapsible is true', async () => {
    render(Collapsible)

    await userEvent.click(page.getByRole('button', { name: 'React Trigger' }))

    await expect.element(page.getByRole('button', { name: 'React Trigger' })).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(page.getByRole('button', { name: 'React Trigger' }))
    await expect.element(page.getByRole('button', { name: 'React Trigger' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('should disable all items when disabled is true', async () => {
    render(Disabled)
    await expect.element(page.getByRole('button', { name: 'React Trigger' })).toBeDisabled()
  })

  it('should allow multiple items to be expanded when multiple is true', async () => {
    render(Multiple)

    await userEvent.click(page.getByRole('button', { name: 'React Trigger' }))
    await userEvent.click(page.getByRole('button', { name: 'Vue Trigger' }))

    await expect.element(page.getByRole('button', { name: 'React Trigger' })).toHaveAttribute('aria-expanded', 'true')
    await expect.element(page.getByRole('button', { name: 'Vue Trigger' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('should call onValueChange when an item is clicked', async () => {
    const onValueChange = vi.fn()
    render(Basic, { props: { onValueChange } })

    await userEvent.click(page.getByRole('button', { name: 'React Trigger' }))
    expect(onValueChange).toHaveBeenCalled()
  })

  it('should focus the next/previous item on arrow up & down', async () => {
    render(Basic)

    const firstTrigger = page.getByRole('button', { name: 'React Trigger' })
    const secondTrigger = page.getByRole('button', { name: 'Solid Trigger' })

    await userEvent.click(firstTrigger)

    await userEvent.type(firstTrigger, '{arrowdown}')
    await expect.element(secondTrigger).toHaveFocus()

    await userEvent.type(secondTrigger, '{arrowup}')
    await expect.element(firstTrigger).toHaveFocus()
  })

  it('should focus the first/last item on home & end', async () => {
    render(Basic)

    const firstTrigger = page.getByRole('button', { name: 'React Trigger' })
    const lastTrigger = page.getByRole('button', { name: 'Vue Trigger' })

    await userEvent.click(lastTrigger)

    await userEvent.type(lastTrigger, '{home}')
    await expect.element(firstTrigger).toHaveFocus()

    await userEvent.type(firstTrigger, '{end}')
    await expect.element(lastTrigger).toHaveFocus()
  })

  it('should not collapse the current visible item', async () => {
    render(Basic)

    const firstTrigger = page.getByRole('button', { name: 'React Trigger' })

    await userEvent.click(firstTrigger)
    await expect.element(firstTrigger).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(firstTrigger)
    await expect.element(firstTrigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('should move the focus to the next element when pressing tab', async () => {
    render(Basic)

    const firstTrigger = page.getByRole('button', { name: 'React Trigger' })
    const secondTrigger = page.getByRole('button', { name: 'Solid Trigger' })

    await userEvent.click(firstTrigger)

    await userEvent.type(firstTrigger, '{tab}')
    await expect.element(secondTrigger).toHaveFocus()
  })

  it('should lazy mount an accordion item', async () => {
    render(Basic, { props: { lazyMount: true, collapsible: true } })

    const button = page.getByRole('button', { name: 'React Trigger' })

    await expect.element(page.getByText('React Content')).not.toBeInTheDocument()
    await userEvent.click(button)

    await expect.element(page.getByText('React Content')).toBeVisible()
    await userEvent.click(button)

    await vi.waitFor(async () =>
      await expect.element(page.getByText('React Content')).not.toBeVisible(),
    )
  })

  it('should not have aria-controls if lazy mounted', async () => {
    render(Basic, { props: { lazyMount: true } })

    const button = page.getByRole('button', { name: 'React Trigger' })

    await expect.element(button).not.toHaveAttribute('aria-controls')

    await userEvent.click(button)
    await expect.element(button).toHaveAttribute('aria-controls')
  })

  it('should lazy mount and unmount on exit an accordion item', async () => {
    render(Basic, {
      props: { lazyMount: true, unmountOnExit: true, collapsible: true },
    })

    const button = page.getByRole('button', { name: 'React Trigger' })
    await expect.element(page.getByText('React Content')).not.toBeInTheDocument()

    await userEvent.click(button)
    await expect.element(page.getByText('React Content')).toBeVisible()

    await userEvent.click(button)
    await vi.waitFor(async () => await expect.element(page.getByText('React Content')).not.toBeInTheDocument())
  })
})
