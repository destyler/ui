import axe from 'axe-core'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { assertAxeResults } from './axe-policy'

interface Fixtures {
  checkbox: () => unknown
  dialog: () => unknown
  tree: () => unknown
}

async function scanBody(modalKeyboardTrapVerified = false) {
  // Scan the whole body, including portals; no severity or subtree filters.
  const results = await axe.run(document.body, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    rules: { 'color-contrast': { enabled: false } },
  })
  const manualReview = assertAxeResults(results, modalKeyboardTrapVerified)
  for (const result of manualReview) {
    console.warn('[browser-smoke] NOT a clean axe scan: aria-hidden-focus / focusable-modal-open needs human assistive-technology review. Native keyboard trap assertions passed.', result.nodes.map(node => node.target))
  }
}

function treePart(part: string, value: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(`[data-scope="tree-view"][data-part="${part}"][data-value="${value}"]`)
  if (!element)
    throw new Error(`Missing tree ${part}: ${value}`)
  return element
}

async function expectRovingFocus(part: string, value: string) {
  await expect.element(treePart(part, value)).toHaveFocus()
  await expect.element(treePart(part, value)).toHaveAttribute('tabindex', '0')
  expect(page.getByRole('tree').element().querySelectorAll('[tabindex="0"]')).toHaveLength(1)
}

export function browserSmoke(fixtures: Fixtures) {
  describe('real-browser accessibility smoke', () => {
    let start: HTMLButtonElement
    beforeEach(() => {
      // One explicit starting point; every tested transition uses browser keys.
      start = document.createElement('button')
      start.textContent = 'Before the example'
      document.body.prepend(start)
      start.focus()
    })
    afterEach(() => start.remove())

    it('Checkbox: accessible label, native Tab and repeated Space toggle', async () => {
      await fixtures.checkbox()
      const checkbox = page.getByRole('checkbox', { name: 'Checkbox', exact: true })
      await expect.element(checkbox).toHaveAccessibleName('Checkbox')
      await expect.element(checkbox).not.toBeChecked()
      await userEvent.tab()
      await expect.element(checkbox).toHaveFocus()
      for (let repeat = 0; repeat < 2; repeat++) {
        await userEvent.keyboard('[Space]')
        await expect.element(checkbox).toBeChecked()
        await scanBody()
        await userEvent.keyboard('[Space]')
        await expect.element(checkbox).not.toBeChecked()
      }
      await scanBody()
    })

    it('Dialog: modal semantics, native focus wrap, Escape restoration and reopen', async () => {
      await fixtures.dialog()
      const trigger = page.getByRole('button', { name: 'Open Dialog', exact: true })
      await userEvent.tab()
      await expect.element(trigger).toHaveFocus()
      for (let repeat = 0; repeat < 2; repeat++) {
        await userEvent.keyboard('[Enter]')
        const dialog = page.getByRole('dialog', { name: 'Dialog Title', exact: true })
        const close = page.getByRole('button', { name: 'Close', exact: true })
        await expect.element(dialog).toBeVisible()
        // Role locators exclude hidden elements. Retain this mounted example's
        // content so the close assertion tests visibility after Escape.
        const dialogElement = dialog.element()
        await expect.element(dialog).toHaveAccessibleDescription('Dialog Description')
        await expect.element(dialog).toHaveAttribute('aria-modal', 'true')
        await expect.element(close).toHaveFocus()
        // These existing examples have one focusable modal control. Both ends
        // must wrap to it, never to the trigger or the starting button.
        await userEvent.tab()
        await expect.element(close).toHaveFocus()
        await userEvent.tab({ shift: true })
        await expect.element(close).toHaveFocus()
        await scanBody(true)
        await userEvent.keyboard('[Escape]')
        await expect.element(dialogElement).toHaveAttribute('data-state', 'closed')
        await expect.element(dialogElement).not.toBeVisible()
        await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
        await expect.element(trigger).toHaveFocus()
      }
      await scanBody()
    })

    it('Tree: accessible name, roving focus, arrows, selection and repeated expansion', async () => {
      await fixtures.tree()
      await expect.element(page.getByRole('tree', { name: 'Tree', exact: true })).toBeVisible()
      await userEvent.tab()
      await expectRovingFocus('branch-control', 'node_modules')
      await userEvent.keyboard('[ArrowDown]')
      await expectRovingFocus('branch-control', 'src')
      await userEvent.keyboard('[ArrowUp]')
      await expectRovingFocus('branch-control', 'node_modules')
      await userEvent.keyboard('[ArrowDown]')
      await expectRovingFocus('branch-control', 'src')
      const branch = treePart('branch', 'src')
      await expect.element(branch).toHaveAttribute('aria-expanded', 'false')
      for (let repeat = 0; repeat < 2; repeat++) {
        await userEvent.keyboard('[ArrowRight]')
        await expect.element(branch).toHaveAttribute('aria-expanded', 'true')
        await expectRovingFocus('branch-control', 'src')
        await userEvent.keyboard('[ArrowRight]')
        await expectRovingFocus('item', 'src/app.tsx')
        await userEvent.keyboard('[ArrowDown]')
        await expectRovingFocus('item', 'src/index.ts')
        await userEvent.keyboard('[ArrowUp]')
        await expectRovingFocus('item', 'src/app.tsx')
        await userEvent.keyboard('[Enter]')
        await expect.element(treePart('item', 'src/app.tsx')).toHaveAttribute('aria-selected', 'true')
        await scanBody()
        await userEvent.keyboard('[ArrowLeft]')
        await expectRovingFocus('branch-control', 'src')
        await userEvent.keyboard('[ArrowLeft]')
        await expect.element(branch).toHaveAttribute('aria-expanded', 'false')
        await expect.element(page.getByText('app.tsx', { exact: true })).not.toBeVisible()
        await expectRovingFocus('branch-control', 'src')
      }
      await scanBody()
    })
  })
}
