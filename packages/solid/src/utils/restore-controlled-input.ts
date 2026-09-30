import type { PropTypes } from '@destyler/solid'

/** Reconcile browser pre-activation with a controlled parent's accepted state. */
export function restoreControlledInput(
  props: PropTypes['input'],
  restore: (input: HTMLInputElement) => void,
): PropTypes['input'] {
  const onClick = props.onClick
  return {
    ...props,
    onClick(event) {
      // Read currentTarget before Solid's delegated event traversal moves on.
      const input = event.currentTarget
      try {
        if (typeof onClick === 'function')
          onClick(event)
        else if (onClick)
          onClick[0](onClick[1], event)
      }
      finally {
        // Native input/change listeners must see the proposal, and a later
        // click handler may still cancel activation. Restore after dispatch
        // from the latest parent state, once both have had their opportunity.
        queueMicrotask(() => {
          if (input.isConnected)
            restore(input)
        })
      }
    },
  }
}

export function restoreRadioGroup(input: HTMLInputElement, value: string | null | undefined) {
  // Restore the browser-unchecked sibling as well. Query the native root so
  // direct hook consumers and portalled inputs need no compound Root element.
  const owner = input.getAttribute('data-ownedby')
  const root = input.getRootNode() as Document | ShadowRoot | Element
  const inputs = root.querySelectorAll<HTMLInputElement>('input[type="radio"]')
  for (const item of inputs) {
    if (item.getAttribute('data-ownedby') === owner)
      item.checked = item.value === value
  }
  input.checked = input.value === value
}
