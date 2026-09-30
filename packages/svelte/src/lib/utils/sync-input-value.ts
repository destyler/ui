import { tick } from 'svelte'

/** Reconcile a native edit that a controlled machine did not accept. */
export function createInputValueSync(
  getInputProps: () => { value?: unknown },
  getState: () => unknown,
) {
  return async (event: Event) => {
    if ((event as InputEvent).isComposing)
      return
    const input = event.currentTarget as HTMLInputElement | HTMLTextAreaElement
    const previousState = getState()
    await tick()
    if (!input.isConnected || !Object.is(previousState, getState()))
      return

    // Read the normalized core value after parent bindings have settled. Only
    // rejected edits need reconciliation; accepted edits retain core formatting
    // and partial-number behavior. Never interrupt an active IME composition.
    const value = String(getInputProps().value ?? '')
    if (input.value === value)
      return
    const { selectionStart, selectionEnd, selectionDirection } = input
    input.value = value
    if (selectionStart !== null && selectionEnd !== null)
      input.setSelectionRange(selectionStart, selectionEnd, selectionDirection ?? undefined)
  }
}
