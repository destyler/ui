import { tick } from 'svelte'

/** Reconcile a native edit that a controlled machine did not accept. */
export function createInputValueSync(
  getInputProps: () => { value?: unknown },
  getState: () => unknown,
  canSync: () => boolean = () => true,
) {
  let version = 0
  return async (event: Event) => {
    const currentVersion = ++version
    if ((event as InputEvent).isComposing)
      return
    const input = event.currentTarget as HTMLInputElement | HTMLTextAreaElement
    const nativeValue = input.value
    const { selectionStart, selectionEnd, selectionDirection } = input
    const previousState = getState()
    await tick()
    if (currentVersion !== version || !canSync() || !input.isConnected || !Object.is(previousState, getState()))
      return

    // Read the normalized core value after parent bindings have settled. Only
    // rejected edits need reconciliation; accepted edits retain core formatting
    // and partial-number behavior. Never interrupt an active IME composition.
    const value = String(getInputProps().value ?? '')
    if (nativeValue === value && input.value === value)
      return
    if (input.value !== value)
      input.value = value
    if (selectionStart !== null && selectionEnd !== null)
      input.setSelectionRange(selectionStart, selectionEnd, selectionDirection ?? undefined)
  }
}
