import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import Fixture from './Stage2Contracts.svelte'

function formEntries(form: HTMLFormElement) {
  const entries: Array<[string, FormDataEntryValue]> = []
  new FormData(form).forEach((value, name) => entries.push([name, value]))
  return entries
}

describe('slider thumb ownership and controlled arrays', () => {
  it('moves hidden-input identity, form name and indicator value with the retained thumb', async () => {
    const screen = await render(Fixture)
    const first = screen.getByTestId('first-thumb').element()
    const input = first.querySelector('input')!
    const indicator = first.querySelector('[data-part="dragging-indicator"]')!
    expect(input.id).toBe('slider:stage2-slider:input:0')
    expect(input.name).toBe('low')
    expect(input.value).toBe('20')
    expect(indicator.textContent?.trim()).toBe('20')
    await screen.getByRole('button', { name: 'Swap indices' }).click()
    expect(screen.getByTestId('first-thumb').element()).toBe(first)
    expect(first.getAttribute('aria-valuenow')).toBe('80')
    expect(input.id).toBe('slider:stage2-slider:input:1')
    expect(input.name).toBe('high')
    expect(input.value).toBe('80')
    expect(indicator.textContent?.trim()).toBe('80')
    expect(formEntries(screen.getByTestId('slider-form').element() as HTMLFormElement)).toEqual([['high', '80'], ['low', '20']])
    await screen.getByRole('button', { name: 'Rename first' }).click()
    expect(input.name).toBe('renamed')
    await screen.getByRole('button', { name: 'Swap indices' }).click()
    expect(input.id).toBe('slider:stage2-slider:input:0')
    expect(input.value).toBe('20')
    expect(indicator.textContent?.trim()).toBe('20')
  })

  it('keeps indicator placement and dragging state on the current thumb index', async () => {
    const screen = await render(Fixture, { props: { id: 'stage2-indicator' } })
    const first = screen.getByTestId('first-thumb').element()
    const second = screen.getByTestId('second-thumb').element()
    const firstIndicator = first.querySelector<HTMLElement>('[data-part="dragging-indicator"]')!
    const secondIndicator = second.querySelector<HTMLElement>('[data-part="dragging-indicator"]')!
    first.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch', pointerId: 1 }))
    await expect.element(firstIndicator).toHaveAttribute('data-state', 'open')
    expect(firstIndicator.hidden).toBe(false)
    expect(firstIndicator.style.insetInlineStart).toBe('var(--slider-thumb-offset-0)')
    expect(secondIndicator.hidden).toBe(true)
    // Change props without pointerup: native click() models an application update mid-drag.
    const swapButton = screen.getByRole('button', { name: 'Swap indices' }).element() as HTMLButtonElement
    swapButton.click()
    await expect.element(first).toHaveAttribute('data-index', '1')
    expect(firstIndicator.style.insetInlineStart).toBe('var(--slider-thumb-offset-1)')
    expect(firstIndicator.hidden).toBe(true)
    expect(firstIndicator.getAttribute('data-state')).toBe('closed')
    expect(secondIndicator.style.insetInlineStart).toBe('var(--slider-thumb-offset-0)')
    expect(secondIndicator.hidden).toBe(false)
    expect(secondIndicator.getAttribute('data-state')).toBe('open')
    swapButton.click()
    await expect.element(first).toHaveAttribute('data-index', '0')
    expect(firstIndicator.style.insetInlineStart).toBe('var(--slider-thumb-offset-0)')
    expect(firstIndicator.hidden).toBe(false)
    expect(secondIndicator.hidden).toBe(true)
    document.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', pointerId: 1 }))
    await expect.element(firstIndicator).toHaveAttribute('data-state', 'closed')
    expect(firstIndicator.hidden).toBe(true)
    // Complete the existing core focus RAF inside this fixture's lifetime.
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  })

  it.each(['accept', 'veto', 'delay'] as const)('preserves exact arrays when the parent chooses %s', async (mode) => {
    const onValueChange = vi.fn()
    const screen = await render(Fixture, { props: { id: `stage2-controlled-${mode}`, mode, onValueChange } })
    screen.getByTestId('second-thumb').element().focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onValueChange).toHaveBeenLastCalledWith({ value: [20, 81] })
    await expect.element(screen.getByTestId('values')).toHaveTextContent(mode === 'accept' ? '20, 81' : '20, 80')
    if (mode === 'delay') {
      await screen.getByRole('button', { name: 'Accept pending' }).click()
      await expect.element(screen.getByTestId('values')).toHaveTextContent('20, 81')
    }
    expect(formEntries(screen.getByTestId('slider-form').element() as HTMLFormElement)).toEqual([['low', '20'], ['high', mode === 'veto' ? '80' : '81']])
  })

  it.each(['disabled', 'readOnly'] as const)('does not request changes while %s', async (prop) => {
    const onValueChange = vi.fn()
    const screen = await render(Fixture, { props: { id: `stage2-${prop}`, [prop]: true, onValueChange } })
    screen.getByTestId('first-thumb').element().focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onValueChange).not.toHaveBeenCalled()
    await expect.element(screen.getByTestId('values')).toHaveTextContent('20, 80')
  })
})
