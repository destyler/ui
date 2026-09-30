import { flushSync, tick } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import NumberResetFixture from './number-reset.fixture.svelte'

for (const entry of ['root', 'provider', 'hook'] as const) {
  describe(`${entry}: NumberInput form reset`, () => {
    it.each(['controlled', 'accepted', 'uncontrolled'] as const)('%s restores untouched, edited and composing inputs including after replacement', async (mode) => {
      const screen = await render(NumberResetFixture, { props: { entry, mode } })
      for (const action of ['untouched', 'edited', 'composing', 'replaced']) {
        if (action === 'replaced') {
          await screen.rerender({ showInput: false })
          await screen.rerender({ showInput: true })
        }
        const input = screen.getByTestId('input').element() as HTMLInputElement
        if (action === 'edited')
          await screen.getByTestId('input').fill('12')
        if (action === 'composing') {
          input.focus()
          input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
          input.value = '123'
          input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '123', isComposing: true }))
          await new Promise(resolve => setTimeout(resolve, 0))
          expect(input.value).toBe('123')
        }
        // form.reset() deliberately does not blur an active composing input.
        const form = screen.getByTestId('form').element() as HTMLFormElement
        form.reset()
        // A focused core input may keep raw numeric text; both representations
        // must preserve the seed, rather than the browser-reset empty value.
        await vi.waitFor(() => expect(['10', '10.00']).toContain(input.value))
        await expect.element(screen.getByTestId('api-state')).toHaveTextContent('10.00')
        expect(new FormData(form).get('answer')).toBe(input.value)
        if (action === 'composing') {
          input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '123' }))
          await vi.waitFor(() => expect(['10', '10.00']).toContain(input.value))
        }
      }
    })

    it.each(['controlled', 'accepted', 'uncontrolled'] as const)('%s resets an input that first mounts after the machine starts', async (mode) => {
      const screen = await render(NumberResetFixture, { props: { entry, mode, showInput: false } })
      await screen.rerender({ showInput: true })
      await screen.getByTestId('input').fill('12')
      const input = screen.getByTestId('input').element() as HTMLInputElement
      const form = screen.getByTestId('form').element() as HTMLFormElement
      form.reset()
      await vi.waitFor(() => expect(['10', '10.00']).toContain(input.value))
      await expect.element(screen.getByTestId('api-state')).toHaveTextContent('10.00')
      expect(new FormData(form).get('answer')).toBe(input.value)
    })

    it('uses the original reset seed after the native input moves to another form', async () => {
      const screen = await render(NumberResetFixture, { props: { entry, mode: 'accepted' } })
      await screen.getByTestId('input').fill('12')
      await screen.rerender({ formId: 'moved-number-form' })
      const input = screen.getByTestId('input').element() as HTMLInputElement
      const original = screen.getByTestId('form').element() as HTMLFormElement
      const moved = screen.getByTestId('other-form').element() as HTMLFormElement
      expect(input.form).toBe(moved)
      // Reset the old form first: its stale listener must be gone before target phase.
      original.reset()
      await new Promise(resolve => setTimeout(resolve, 0))
      await expect.element(screen.getByTestId('api-state')).toHaveTextContent('12.00')
      expect(input.value).toBe('12')
      moved.reset()
      await vi.waitFor(() => expect(['10', '10.00']).toContain(input.value))
      await expect.element(screen.getByTestId('api-state')).toHaveTextContent('10.00')
      await screen.getByTestId('input').fill('12')
      original.reset()
      await expect.element(screen.getByTestId('api-state')).toHaveTextContent('12.00')
      expect(input.value).toBe('12')
    })

    it('cleans a removed input’s old form listener and rebinds after remount', async () => {
      const screen = await render(NumberResetFixture, { props: { entry, mode: 'accepted' } })
      await screen.getByTestId('input').fill('12')
      await screen.rerender({ showInput: false })
      const form = screen.getByTestId('form').element() as HTMLFormElement
      form.reset()
      await new Promise(resolve => setTimeout(resolve, 0))
      await expect.element(screen.getByTestId('api-state')).toHaveTextContent('12.00')
      await screen.rerender({ showInput: true })
      form.reset()
      await vi.waitFor(() => expect(['10', '10.00']).toContain((screen.getByTestId('input').element() as HTMLInputElement).value))
      await expect.element(screen.getByTestId('api-state')).toHaveTextContent('10.00')
    })

    it('observes a reset whose propagation is stopped without canceling it', async () => {
      const screen = await render(NumberResetFixture, { props: { entry } })
      const form = screen.getByTestId('form').element() as HTMLFormElement
      form.addEventListener('reset', event => event.stopPropagation())
      form.reset()
      const input = screen.getByTestId('input').element() as HTMLInputElement
      await vi.waitFor(() => expect(input.value).toBe('10.00'))
      await expect.element(screen.getByTestId('api-state')).toHaveTextContent('10.00')
      expect(new FormData(form).get('answer')).toBe('10.00')
    })

    it('does not reconcile a canceled reset', async () => {
      const screen = await render(NumberResetFixture, { props: { entry, mode: 'accepted', cancelReset: true } })
      await screen.getByTestId('input').fill('12')
      const input = screen.getByTestId('input').element() as HTMLInputElement
      const before = input.value
      ;(screen.getByTestId('form').element() as HTMLFormElement).reset()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(input.value).toBe(before)
      await expect.element(screen.getByTestId('api-state')).toHaveTextContent('12.00')
    })
  })
}

for (const entry of ['root', 'provider', 'hook'] as const) {
  it.each(['accepted', 'uncontrolled'] as const)(`${entry}: queued numeric writes cannot interrupt a new %s composition`, async (mode) => {
    const screen = await render(NumberResetFixture, { props: { entry, mode } })
    const input = screen.getByTestId('input').element() as HTMLInputElement
    input.focus()
    input.value = '12'
    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '12' }))
    flushSync()
    await tick()
    // Start composition after core scheduled its frame write but before that
    // write executes. Waiting a frame here would hide the regression.
    input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
    input.value = '編集中'
    input.setSelectionRange(1, 1)
    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '編集中', isComposing: true }))
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    expect(input.value).toBe('編集中')
    expect(input.selectionStart).toBe(1)
    expect(input.selectionEnd).toBe(1)
  })
}
