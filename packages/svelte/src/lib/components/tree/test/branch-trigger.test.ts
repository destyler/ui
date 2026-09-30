import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import BranchTriggerFixture from './BranchTriggerFixture.svelte'
import TabNavigation from './TabNavigation.svelte'

// Include native default tab stops, not only explicit tabindex="0" attributes.
function tabStops(tree: HTMLElement) {
  return Array.from(tree.querySelectorAll<HTMLElement>('*'))
    .filter(element => element.tabIndex >= 0 && element.getClientRects().length > 0)
}

describe('[tree] branch trigger', () => {
  it('keeps one native tab stop and tabs out of the tree in both directions', async () => {
    const screen = await render(TabNavigation)
    const tree = screen.getByRole('tree').element() as HTMLElement
    const first = tree.querySelector<HTMLElement>('[data-part="branch-control"][data-value="node_modules"]')!
    const second = tree.querySelector<HTMLElement>('[data-part="branch-control"][data-value="src"]')!
    const before = screen.getByRole('button', { name: 'Before tree' })
    const after = screen.getByRole('button', { name: 'After tree' })

    for (const trigger of tree.querySelectorAll<HTMLElement>('[data-part="branch-trigger"]')) {
      expect(trigger.tagName).toBe('DIV')
      expect(trigger.tabIndex).toBe(-1)
    }
    expect(tabStops(tree)).toEqual([first])

    await before.click()
    await userEvent.tab()
    await vi.waitFor(() => expect(first).toHaveFocus())
    await userEvent.tab()
    await expect.element(after).toHaveFocus()
    await userEvent.tab({ shift: true })
    await vi.waitFor(() => expect(first).toHaveFocus())
    await userEvent.tab({ shift: true })
    await expect.element(before).toHaveFocus()

    await userEvent.tab()
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(second).toHaveFocus())
    expect(tabStops(tree)).toEqual([second])
    await userEvent.tab()
    await expect.element(after).toHaveFocus()
    await userEvent.tab({ shift: true })
    await vi.waitFor(() => expect(second).toHaveFocus())
  })

  it('expands by click and keyboard without adding branch-trigger tab stops', async () => {
    const screen = await render(TabNavigation)
    const tree = screen.getByRole('tree').element() as HTMLElement
    const branch = tree.querySelector<HTMLElement>('[data-part="branch"][data-value="node_modules"]')!
    const control = branch.querySelector<HTMLElement>('[data-part="branch-control"]')!
    const trigger = branch.querySelector<HTMLElement>('[data-part="branch-trigger"]')!
    const content = branch.querySelector<HTMLElement>('[data-part="branch-content"]')!

    control.focus()
    for (let cycle = 0; cycle < 2; cycle++) {
      await userEvent.click(trigger)
      await vi.waitFor(() => expect(branch).toHaveAttribute('aria-expanded', 'true'))
      expect(content).toBeVisible()
      expect(tabStops(tree)).toHaveLength(1)
      await userEvent.click(trigger)
      await vi.waitFor(() => expect(branch).toHaveAttribute('aria-expanded', 'false'))
      expect(content).not.toBeVisible()
    }

    control.focus()
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(branch).toHaveAttribute('aria-expanded', 'true'))
    expect(control).toHaveFocus()
    expect(tabStops(tree)).toEqual([control])
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(branch).toHaveAttribute('aria-expanded', 'false'))
    expect(control).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(branch).toHaveAttribute('aria-expanded', 'true'))
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(branch).toHaveAttribute('aria-expanded', 'false'))
    await userEvent.tab()
    await expect.element(screen.getByRole('button', { name: 'After tree' })).toHaveFocus()
  })

  it('preserves caller attributes and explicit tabindex overrides', async () => {
    const onTriggerClick = vi.fn()
    const screen = await render(BranchTriggerFixture, { props: { tabindex: 0, onTriggerClick } })
    const trigger = screen.container.querySelector<HTMLElement>('[data-part="branch-trigger"]')!
    const branch = screen.container.querySelector('[data-part="branch"]')!

    expect(trigger.tagName).toBe('DIV')
    expect(trigger).toHaveAttribute('id', 'parent-trigger')
    expect(trigger).toHaveAttribute('class', 'parent-trigger')
    expect(trigger).toHaveAttribute('data-parent', 'present')
    expect(trigger.tabIndex).toBe(0)
    await userEvent.click(trigger)
    expect(onTriggerClick).toHaveBeenCalledOnce()
    await vi.waitFor(() => expect(branch).toHaveAttribute('aria-expanded', 'true'))
  })

  it('forwards asChild props and composes both click handlers with expansion', async () => {
    const onTriggerClick = vi.fn()
    const onChildClick = vi.fn()
    const screen = await render(BranchTriggerFixture, { props: { asChild: true, onTriggerClick, onChildClick } })
    const trigger = screen.container.querySelector<HTMLElement>('[data-part="branch-trigger"]')!
    const branch = screen.container.querySelector('[data-part="branch"]')!
    const control = screen.container.querySelector('[data-part="branch-control"]')!

    expect(control.children).toHaveLength(1)
    expect(trigger.parentElement).toBe(control)
    expect(trigger.tagName).toBe('BUTTON')
    expect(trigger).toHaveAttribute('type', 'button')
    expect(trigger).toHaveAttribute('id', 'child-trigger')
    expect(trigger).toHaveAttribute('class', 'parent-trigger child-trigger')
    expect(trigger).toHaveAttribute('data-parent', 'present')
    expect(trigger).toHaveAttribute('data-value', 'branch')
    expect(trigger.tabIndex).toBe(-1)

    for (let cycle = 1; cycle <= 2; cycle++) {
      await userEvent.click(trigger)
      expect(onTriggerClick).toHaveBeenCalledTimes(cycle)
      expect(onChildClick).toHaveBeenCalledTimes(cycle)
      await vi.waitFor(() => expect(branch).toHaveAttribute('aria-expanded', String(cycle === 1)))
    }
  })
})
