import { raf, setElementValue } from '@destyler/dom'

/** Keep core's numeric cursor restoration, but validate ownership at RAF time. */
export function syncNumberInputElement(input: HTMLInputElement, value: string, canSync: () => boolean) {
  let selection: { start: number | null, before: string, after: string } | undefined
  if (input.ownerDocument.activeElement === input) {
    try {
      const { selectionStart: start, selectionEnd: end } = input
      selection = {
        start,
        before: start === null ? '' : input.value.substring(0, start),
        after: end === null ? '' : input.value.substring(end),
      }
    }
    catch {}
  }
  return raf(() => {
    if (!input.isConnected || !canSync() || input.value === value)
      return
    setElementValue(input, value)
    if (input.ownerDocument.activeElement !== input)
      return
    try {
      // A consumer may override the input's type. Use its resulting value and
      // tolerate native types that do not support text selection, as core does.
      const currentValue = input.value
      let position = currentValue.length
      if (selection?.start !== null && selection?.start !== undefined) {
        const { start, before, after } = selection
        if (currentValue.endsWith(after)) {
          position = currentValue.length - after.length
        }
        else if (currentValue.startsWith(before)) {
          position = before.length
        }
        else {
          const index = currentValue.indexOf(before[start - 1], start - 1)
          if (index !== -1)
            position = index + 1
        }
      }
      input.setSelectionRange(position, position)
    }
    catch {}
  })
}
