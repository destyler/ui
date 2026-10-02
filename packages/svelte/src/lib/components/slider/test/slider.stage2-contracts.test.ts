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

  it.each(['accept', 'veto', 'delay'] as const)('preserves exact arrays when the parent chooses %s', async (mode) => {
    const onValueChange = vi.fn()
    const screen = await render(Fixture, { props: { mode, onValueChange } })
    screen.getByTestId('second-thumb').element().focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onValueChange).toHaveBeenLastCalledWith({ value: [20, 81] })
    await expect.element(screen.getByTestId('values')).toHaveTextContent(mode === 'accept' ? '20, 81' : '20, 80')
    if (mode === 'delay') {
      await screen.getByRole('button', { name: 'Accept pending' }).click()
      await expect.element(screen.getByTestId('values')).toHaveTextContent('20, 81')
    }
  })

  it.each(['disabled', 'readOnly'] as const)('does not request changes while %s', async (prop) => {
    const onValueChange = vi.fn()
    const screen = await render(Fixture, { props: { [prop]: true, onValueChange } })
    screen.getByTestId('first-thumb').element().focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onValueChange).not.toHaveBeenCalled()
    await expect.element(screen.getByTestId('values')).toHaveTextContent('20, 80')
  })
})
