import { tick } from 'svelte'

/** Restore accepted state after native activation and parent bindings settle. */
export function createCheckedSync(getState: () => { checked: boolean, indeterminate?: boolean }) {
  return async (event: Event) => {
    const input = event.currentTarget as HTMLInputElement
    await tick()
    if (!input.isConnected)
      return
    const state = getState()
    input.checked = state.checked
    input.indeterminate = !!state.indeterminate
  }
}

export function createRadioCheckedSync(isChecked: (value: string) => boolean) {
  return async (event: Event) => {
    const input = event.currentTarget as HTMLInputElement
    await tick()
    if (!input.isConnected)
      return
    // Native radio activation also unchecks the previous item. Reconcile all
    // inputs owned by this group, including a previously selected sibling.
    const root = input.getRootNode() as Document | ShadowRoot
    for (const item of root.querySelectorAll<HTMLInputElement>('input[type="radio"][data-ownedby]')) {
      if (item.dataset.ownedby === input.dataset.ownedby)
        item.checked = isChecked(item.value)
    }
  }
}
