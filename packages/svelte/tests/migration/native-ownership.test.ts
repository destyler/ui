import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import NativeOwnershipFixture from './native-ownership.fixture.svelte'

const families = ['checkbox', 'switch', 'radio', 'edit', 'combobox'] as const
const entries = ['root', 'provider', 'hook'] as const

for (const entry of entries) {
  describe.each(families)(`${entry}: %s native ownership`, (family) => {
    it.each(['controlled', 'accepted', 'uncontrolled'] as const)('%s reconciles DOM, API and form data after repeated native changes', async (mode) => {
      const onChange = vi.fn()
      const screen = await render(NativeOwnershipFixture, { props: { entry, family, mode, onChange } })
      const isChecked = family === 'checkbox' || family === 'switch'
      const target = screen.getByTestId(family === 'radio' ? 'input-two' : 'input')
      const input = target.element() as HTMLInputElement
      const initial = isChecked ? 'true' : 'one'
      for (let attempt = 0; attempt < 2; attempt++) {
        if (isChecked || family === 'radio')
          input.click()
        else
          await target.fill('two')
        const next = isChecked ? 'false' : 'two'
        const expected = mode === 'controlled' ? initial : next
        await expect.element(screen.getByTestId('api-state')).toHaveTextContent(expected)
        await vi.waitFor(() => {
          if (isChecked) {
            expect(input.checked).toBe(mode === 'controlled')
            expect(screen.getByTestId('control').element().getAttribute('data-state')).toBe(mode === 'controlled' ? 'checked' : 'unchecked')
          }
          else if (family === 'radio') {
            expect(input.checked).toBe(mode !== 'controlled')
            expect((screen.getByTestId('input-one').element() as HTMLInputElement).checked).toBe(mode === 'controlled')
            expect(screen.getByTestId(`control-${expected}`).element().getAttribute('data-state')).toBe('checked')
          }
          else {
            expect(input.value).toBe(expected)
          }
        })
        const formData = new FormData(screen.getByTestId('form').element() as HTMLFormElement)
        // Combobox's text input is intentionally unnamed; its selection owns the submitted value.
        if (family !== 'combobox')
          expect(formData.get('answer')).toBe(isChecked ? mode === 'controlled' ? 'on' : null : expected)
        expect(onChange).toHaveBeenLastCalledWith(isChecked ? false : 'two')
        if (mode === 'controlled') {
          expect(onChange).toHaveBeenCalledTimes(attempt + 1)
        }
        else {
          if (isChecked)
            input.click()
          else if (family === 'radio')
            (screen.getByTestId('input-one').element() as HTMLInputElement).click()
          else
            await target.fill('one')
          await expect.element(screen.getByTestId('api-state')).toHaveTextContent(initial)
        }
      }
    })

    it('reflects delayed parent acceptance after first restoring a rejected native change', async () => {
      const screen = await render(NativeOwnershipFixture, { props: { entry, family } })
      const isChecked = family === 'checkbox' || family === 'switch'
      const target = screen.getByTestId(family === 'radio' ? 'input-two' : 'input')
      const input = target.element() as HTMLInputElement
      if (isChecked || family === 'radio')
        input.click()
      else
        await target.fill('two')
      await vi.waitFor(() => expect(isChecked || family === 'radio' ? input.checked : input.value).toBe(isChecked ? true : family === 'radio' ? false : 'one'))
      await screen.rerender({ accepted: isChecked ? false : 'two' })
      await expect.element(screen.getByTestId('api-state')).toHaveTextContent(isChecked ? 'false' : 'two')
      await vi.waitFor(() => expect(isChecked || family === 'radio' ? input.checked : input.value).toBe(isChecked ? false : family === 'radio' ? true : 'two'))
    })
  })
}

it.each(['edit', 'combobox'] as const)('direct %s input retains composition text and caret until composition ends', async (family) => {
  const screen = await render(NativeOwnershipFixture, { props: { family } })
  const input = screen.getByTestId('input').element() as HTMLInputElement
  if (family === 'edit')
    await vi.waitFor(() => expect(document.activeElement).toBe(input))
  else
    input.focus()
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
  input.value = '編集中'
  input.setSelectionRange(1, 1)
  input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '編集中', isComposing: true }))
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(input.value).toBe('編集中')
  input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '編集中' }))
  await vi.waitFor(() => expect(input.value).toBe('one'))
  expect(input.selectionStart).toBe(1)
  expect(input.selectionEnd).toBe(1)
})
