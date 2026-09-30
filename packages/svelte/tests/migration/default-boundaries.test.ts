import type { OpenFamily } from './open-cases'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { entries, openFamilies } from './open-cases'
import OpenFixture from './open.fixture.svelte'
import UiDefaultsFixture from './ui-defaults.fixture.svelte'

async function expectOpen(screen: Awaited<ReturnType<typeof render<typeof OpenFixture>>>, open: boolean, family: OpenFamily) {
  await expect.element(screen.getByTestId('api-open')).toHaveTextContent(String(open))
  await expect.element(screen.getByTestId('trigger')).toHaveAttribute('data-state', open ? 'open' : 'closed')
  if (open)
    await expect.element(screen.getByTestId('content')).toBeVisible()
  else
    await expect.element(screen.getByTestId('content')).not.toBeVisible()
  if (family === 'combobox') {
    const option = screen.getByTestId('option-one')
    await expect.element(option).toHaveAttribute('role', 'option')
    await expect.element(option).toHaveTextContent('one')
    if (open)
      await expect.element(option).toBeVisible()
    else
      await expect.element(option).not.toBeVisible()
  }
}

describe.each(entries)('migration: %s boundary', (entry) => {
  for (const family of openFamilies) {
    it.each([false, true])(`${family}: live open=%s wins over defaultOpen on mount`, async (open) => {
      const screen = await render(OpenFixture, { props: { family, entry, open, defaultOpen: !open } })
      await expectOpen(screen, open, family)
      await screen.rerender({ defaultOpen: open, unrelated: 1 })
      await expectOpen(screen, open, family)
      await screen.rerender({ open: !open })
      await expectOpen(screen, !open, family)
    })

    it(`${family}: omitted/undefined open keeps its default seed interactive and initial-only`, async () => {
      const onOpenChange = vi.fn()
      const screen = await render(OpenFixture, { props: { family, entry, open: undefined, defaultOpen: true, onOpenChange } })
      await expectOpen(screen, true, family)
      await screen.getByTestId('request-close').click()
      await expectOpen(screen, false, family)
      expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false }))
      await screen.rerender({ defaultOpen: false, unrelated: 1 })
      await screen.rerender({ defaultOpen: true, unrelated: 2 })
      await expectOpen(screen, false, family)
      await screen.getByTestId('request-open').click()
      await expectOpen(screen, true, family)
      expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true }))
    })

    it(`${family}: controlled state requests changes and waits for parent writeback`, async () => {
      const onOpenChange = vi.fn()
      const screen = await render(OpenFixture, { props: { family, entry, open: false, defaultOpen: true, onOpenChange } })
      await screen.getByTestId('request-open').click()
      await vi.waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
      await expectOpen(screen, false, family)
      await screen.rerender({ open: true })
      await expectOpen(screen, true, family)
      await screen.getByTestId('request-close').click()
      await vi.waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
      await expectOpen(screen, true, family)
      await screen.rerender({ open: false })
      await expectOpen(screen, false, family)
    })
  }

  it('keeps Calendar.defaultView initial-only after interaction and unrelated updates', async () => {
    const onViewChange = vi.fn()
    const screen = await render(UiDefaultsFixture, { props: { family: 'calendar', entry, defaultView: 'year', onViewChange } })
    await expect.element(screen.getByTestId('api-view')).toHaveTextContent('year')
    await expect.element(screen.getByTestId('year-view')).toBeVisible()
    if (entry !== 'hook')
      await expect.element(screen.getByTestId('component-year-view')).toBeVisible()
    await screen.getByTestId('change-view').click()
    await expect.element(screen.getByTestId('api-view')).toHaveTextContent('month')
    expect(onViewChange).toHaveBeenLastCalledWith(expect.objectContaining({ view: 'month' }))
    await screen.rerender({ defaultView: 'day', unrelated: 1 })
    await expect.element(screen.getByTestId('api-view')).toHaveTextContent('month')
    await expect.element(screen.getByTestId('month-view')).toBeVisible()
    if (entry !== 'hook')
      await expect.element(screen.getByTestId('component-month-view')).toBeVisible()
  })

  it('gives Calendar.view priority and reflects subsequent live updates', async () => {
    const screen = await render(UiDefaultsFixture, { props: { family: 'calendar', entry, defaultView: 'year', view: 'month' } })
    await expect.element(screen.getByTestId('api-view')).toHaveTextContent('month')
    await screen.rerender({ view: 'day' })
    await expect.element(screen.getByTestId('api-view')).toHaveTextContent('day')
    await expect.element(screen.getByTestId('day-view')).toBeVisible()
  })

  it.each(['submit', 'cancel'] as const)('leaves defaultEdit after %s, ignores new defaults, and can enter again', async (action) => {
    const onEditChange = vi.fn()
    const onValueCommit = vi.fn()
    const onValueRevert = vi.fn()
    const screen = await render(UiDefaultsFixture, { props: { family: 'edit', entry, defaultEdit: true, onEditChange, onValueCommit, onValueRevert } })
    await expect.element(screen.getByTestId('api-editing')).toHaveTextContent('true')
    await expect.element(screen.getByTestId('edit-input')).not.toHaveAttribute('hidden')
    await expect.element(screen.getByTestId('edit-preview')).toHaveAttribute('hidden')
    expect(onEditChange).not.toHaveBeenCalled()
    await screen.getByTestId('edit-input').fill('Changed')
    await screen.getByTestId(`request-${action}`).click()
    await expect.element(screen.getByTestId('api-editing')).toHaveTextContent('false')
    await expect.element(screen.getByTestId('edit-input')).toHaveAttribute('hidden')
    expect(onEditChange).toHaveBeenCalledExactlyOnceWith({ edit: false })
    if (action === 'submit') {
      expect(onValueCommit).toHaveBeenCalledExactlyOnceWith({ value: 'Changed' })
      expect(onValueRevert).not.toHaveBeenCalled()
      await expect.element(screen.getByTestId('edit-preview')).toHaveTextContent('Changed')
    }
    else {
      expect(onValueRevert).toHaveBeenCalledExactlyOnceWith({ value: 'Original' })
      expect(onValueCommit).not.toHaveBeenCalled()
      await expect.element(screen.getByTestId('edit-preview')).toHaveTextContent('Original')
    }
    await screen.rerender({ defaultEdit: false, unrelated: 1 })
    await screen.rerender({ defaultEdit: true, unrelated: 2 })
    await expect.element(screen.getByTestId('api-editing')).toHaveTextContent('false')
    await screen.getByTestId('request-edit').click()
    await expect.element(screen.getByTestId('api-editing')).toHaveTextContent('true')
    expect(onEditChange).toHaveBeenLastCalledWith({ edit: true })
    await screen.getByTestId(`request-${action}`).click()
    await expect.element(screen.getByTestId('api-editing')).toHaveTextContent('false')
  })

  it.each([false, true])('gives explicit edit=%s priority over its default', async (edit) => {
    const screen = await render(UiDefaultsFixture, { props: { family: 'edit', entry, defaultEdit: !edit, edit } })
    await expect.element(screen.getByTestId('api-editing')).toHaveTextContent(String(edit))
    await screen.rerender({ edit: !edit })
    await expect.element(screen.getByTestId('api-editing')).toHaveTextContent(String(!edit))
  })

  it('keeps controlled edit until its parent writes back', async () => {
    const onEditChange = vi.fn()
    const screen = await render(UiDefaultsFixture, { props: { family: 'edit', entry, defaultEdit: true, edit: false, onEditChange } })
    await screen.getByTestId('request-edit').click()
    expect(onEditChange).toHaveBeenLastCalledWith({ edit: true })
    await expect.element(screen.getByTestId('api-editing')).toHaveTextContent('false')
    await screen.rerender({ edit: true })
    await expect.element(screen.getByTestId('api-editing')).toHaveTextContent('true')
    await screen.getByTestId('request-submit').click()
    expect(onEditChange).toHaveBeenLastCalledWith({ edit: false })
    await expect.element(screen.getByTestId('api-editing')).toHaveTextContent('true')
    await screen.rerender({ edit: false })
    await expect.element(screen.getByTestId('api-editing')).toHaveTextContent('false')
  })
})
