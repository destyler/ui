import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import Stage2Contracts from './Stage2Contracts.vue'

function formEntries(form: HTMLFormElement) {
  const entries: Array<[string, FormDataEntryValue]> = []
  new FormData(form).forEach((value, name) => entries.push([name, value]))
  return entries
}

describe('slider controlled multi-thumb arrays', () => {
  it.each(['accept', 'veto', 'delay'] as const)('preserves parent %s and exact form values', async (mode) => {
    const onValueChange = vi.fn()
    render(Stage2Contracts, { props: { mode, onValueChange } })
    page.getByRole('slider').nth(1).element().focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onValueChange).toHaveBeenLastCalledWith({ value: [20, 81] })
    await expect.element(page.getByTestId('values')).toHaveTextContent(mode === 'accept' ? '20, 81' : '20, 80')
    if (mode === 'delay') {
      await page.getByRole('button', { name: 'Accept pending' }).click()
      await expect.element(page.getByTestId('values')).toHaveTextContent('20, 81')
    }
    expect(formEntries(page.getByTestId('slider-form').element() as HTMLFormElement)).toEqual([['low', '20'], ['high', mode === 'veto' ? '80' : '81']])
  })
})
