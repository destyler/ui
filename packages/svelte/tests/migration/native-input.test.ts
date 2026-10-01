import { tick } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import { assertTextSelection } from '../../../../utils/test/behavior-contracts'
import NativeInputFixture from './native-input.fixture.svelte'

const cases = [
  { family: 'number-input', initial: '10', next: '12', initialState: '10', nextState: '12' },
  { family: 'edit', initial: 'one', next: 'two', initialState: 'one', nextState: 'two' },
  { family: 'combobox', initial: 'one', next: 'two', initialState: 'one', nextState: 'two' },
  { family: 'otp-input', initial: '1', next: '3', initialState: '["1","2"]', nextState: '["3","2"]' },
  { family: 'color-picker', initial: '#ff0000', next: '#0000ff', initialState: '#ff0000', nextState: '#0000ff' },
] as const

describe.each(cases)('$family native input binding', (testCase) => {
  it.each(['controlled', 'bound', 'uncontrolled'] as const)('%s keeps native input and machine state coherent through repeated edits', async (mode) => {
    const onChange = vi.fn()
    const screen = await render(NativeInputFixture, { props: { family: testCase.family, mode, onChange } })
    const input = screen.getByTestId('input')
    const nativeInput = input.element() as HTMLInputElement
    const accepted = mode === 'controlled' ? testCase.initialState : testCase.nextState
    for (let attempt = 0; attempt < 2; attempt++) {
      await input.fill(testCase.next)
      if (testCase.family === 'color-picker')
        await userEvent.keyboard('{Enter}')
      await vi.waitFor(() => expect(nativeInput.value.toLowerCase()).toBe(mode === 'controlled' ? testCase.initial : testCase.next))
      await expect.element(screen.getByTestId('api-state')).toHaveTextContent(accepted)
      expect(onChange).toHaveBeenLastCalledWith(testCase.nextState)
      if (mode === 'bound')
        await expect.element(screen.getByTestId('parent-state')).toHaveTextContent(accepted)
      if (mode !== 'controlled') {
        await input.fill(testCase.initial)
        if (testCase.family === 'color-picker')
          await userEvent.keyboard('{Enter}')
        await expect.element(screen.getByTestId('api-state')).toHaveTextContent(testCase.initialState)
      }
    }
  })
})

it('preserves accepted partial-number editing text while the public value remains formatted', async () => {
  const screen = await render(NativeInputFixture, { props: { family: 'number-input', mode: 'bound' } })
  await screen.getByTestId('input').fill('1.')
  await expect.element(screen.getByTestId('api-state')).toHaveTextContent('1')
  await expect.element(screen.getByTestId('parent-state')).toHaveTextContent('1.')
  expect((screen.getByTestId('input').element() as HTMLInputElement).value).toBe('1.')
})

it('waits for IME composition to finish before restoring a rejected edit and preserves selection', async () => {
  const screen = await render(NativeInputFixture, { props: { family: 'edit', mode: 'controlled' } })
  // defaultEdit schedules core autofocus/select-all. Let that mount action finish
  // before starting the user's composition and choosing its caret position.
  const input = screen.getByTestId('input').element() as HTMLInputElement
  await vi.waitFor(() => expect(document.activeElement).toBe(input))
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
  input.value = '編集中'
  input.setSelectionRange(1, 1)
  input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '編集中', isComposing: true }))
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(input.value).toBe('編集中')
  input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '編集中' }))
  await vi.waitFor(() => expect(input.value).toBe('one'))
  assertTextSelection(input, 'one', 1)
  await expect.element(screen.getByTestId('api-state')).toHaveTextContent('one')
})

it('keeps core number formatting on focus until the user actually edits', async () => {
  const screen = await render(NativeInputFixture, { props: { family: 'number-input', mode: 'bound', formatOptions: { minimumFractionDigits: 2 } } })
  const input = screen.getByTestId('input').element() as HTMLInputElement
  expect(input.value).toBe('10.00')
  input.focus()
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(input.value).toBe('10.00')
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
  input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }))
  await tick()
  await tick()
  expect(input.value).toBe('10.00')
})

it.each(['controlled', 'bound', 'uncontrolled'] as const)('preserves NumberInput composition text until the %s owner decision settles', async (mode) => {
  const screen = await render(NativeInputFixture, { props: { family: 'number-input', mode, formatOptions: { minimumFractionDigits: 2 } } })
  const input = screen.getByTestId('input').element() as HTMLInputElement
  input.focus()
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
  input.value = '編集中'
  input.setSelectionRange(1, 1)
  input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '編集中', isComposing: true }))
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(input.value).toBe('編集中')
  input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '編集中' }))
  // Core 0.2.9 uses raw text after any INPUT.CHANGE, including a rejected IME
  // edit. Svelte must agree before core's deferred veto runs, without briefly
  // restoring formatted text and letting the second writer change it again.
  await tick()
  await tick()
  expect(input.value).toBe(mode === 'controlled' ? '10' : '編集中')
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  await vi.waitFor(() => {
    expect(input.value).toBe(mode === 'controlled' ? '10' : '編集中')
    expect(input.selectionStart).toBe(1)
    expect(input.selectionEnd).toBe(1)
  })
  await expect.element(screen.getByTestId('parent-state')).toHaveTextContent(mode === 'bound' ? '編集中' : '10')
  if (mode === 'controlled') {
    await expect.element(screen.getByTestId('api-state')).toHaveTextContent('10.00')
    input.blur()
    await vi.waitFor(() => expect(input.value).toBe('10.00'))
    input.focus()
    await tick()
    expect(input.value).toBe('10.00')
  }
})

it.each(['controlled', 'bound', 'uncontrolled'] as const)('settles the final NumberInput composition input once for a %s owner', async (mode) => {
  const onChange = vi.fn()
  const screen = await render(NativeInputFixture, { props: { family: 'number-input', mode, onChange, formatOptions: { minimumFractionDigits: 2 } } })
  const input = screen.getByTestId('input').element() as HTMLInputElement
  input.focus()
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
  input.value = '1.'
  input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '1.', isComposing: true }))
  await tick()
  expect(input.value).toBe('1.')
  input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '1.2' }))
  // Browsers can deliver the final input before compositionend's async work
  // settles. It must supersede that work without duplicate change requests.
  input.value = '1.2'
  input.setSelectionRange(1, 1)
  input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '1.2' }))
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  expect(input.value).toBe(mode === 'controlled' ? '10' : '1.2')
  expect(input.selectionStart).toBe(1)
  expect(input.selectionEnd).toBe(1)
  expect(onChange.mock.calls).toEqual([['1.'], ['1.2']])
  await expect.element(screen.getByTestId('api-state')).toHaveTextContent(mode === 'controlled' ? '10.00' : '1.20')
})

it('does not restore NumberInput composition into an input unmounted before reconciliation', async () => {
  const screen = await render(NativeInputFixture, { props: { family: 'number-input', mode: 'controlled', formatOptions: { minimumFractionDigits: 2 } } })
  const input = screen.getByTestId('input').element() as HTMLInputElement
  input.focus()
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
  input.value = '編集中'
  input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '編集中', isComposing: true }))
  await new Promise(resolve => setTimeout(resolve, 0))
  input.setSelectionRange(1, 1)
  input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '編集中' }))
  screen.unmount()
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(input.isConnected).toBe(false)
  expect(input.value).toBe('編集中')
  expect(input.selectionStart).toBe(1)
  expect(input.selectionEnd).toBe(1)
})

it.each([false, true])('does not retain interrupted NumberInput composition after blur and refocus (ending=%s)', async (ending) => {
  const screen = await render(NativeInputFixture, { props: { family: 'number-input', mode: 'controlled', formatOptions: { minimumFractionDigits: 2 } } })
  const input = screen.getByTestId('input').element() as HTMLInputElement
  input.focus()
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
  input.value = '編集中'
  input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '編集中', isComposing: true }))
  await new Promise(resolve => setTimeout(resolve, 0))
  if (ending)
    input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '編集中' }))
  input.blur()
  await new Promise(resolve => setTimeout(resolve, 0))
  input.focus()
  await new Promise(resolve => setTimeout(resolve, 0))
  input.value = '12'
  input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '12', inputType: 'insertText' }))
  await vi.waitFor(() => expect(input.value).toBe('10'))
  await expect.element(screen.getByTestId('parent-state')).toHaveTextContent('10')
  await expect.element(screen.getByTestId('api-state')).toHaveTextContent('10.00')
})

it.each([false, true])('drops composition from an Input replaced under the same Root (ending=%s)', async (ending) => {
  const screen = await render(NativeInputFixture, { props: { family: 'number-input', mode: 'controlled', formatOptions: { minimumFractionDigits: 2 } } })
  const input = screen.getByTestId('input').element() as HTMLInputElement
  input.focus()
  input.value = '12'
  input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '12' }))
  await vi.waitFor(() => expect(input.value).toBe('10'))
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
  input.value = '編集中'
  input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '編集中', isComposing: true }))
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(input.value).toBe('編集中')
  if (ending)
    input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '編集中' }))
  await screen.rerender({ showInput: false })
  expect(input.isConnected).toBe(false)
  await screen.rerender({ showInput: true })
  const replacement = screen.getByTestId('input').element() as HTMLInputElement
  expect(replacement).not.toBe(input)
  expect(replacement.value).toBe('10.00')
  await screen.getByTestId('input').fill('12')
  await vi.waitFor(() => expect(replacement.value).toBe('10'))
  await expect.element(screen.getByTestId('parent-state')).toHaveTextContent('10')
})
