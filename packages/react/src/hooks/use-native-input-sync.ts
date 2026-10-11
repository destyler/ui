import type { CompositionEvent, FocusEvent, InputHTMLAttributes, KeyboardEvent, RefObject } from 'react'
import { raf, setElementValue } from '@destyler/dom'
import { useEffect, useReducer, useRef } from 'react'

type NativeInput = HTMLInputElement | HTMLTextAreaElement
// Derive handler events so React 18 and 19 retain their own event contracts,
// including the narrower input/change events introduced in React 19.3.
type NativeInputProps = InputHTMLAttributes<HTMLInputElement>
type InputEditEvent = Parameters<NonNullable<NativeInputProps['onInput']>>[0]
type ChangeEditEvent = Parameters<NonNullable<NativeInputProps['onChange']>>[0]

/**
 * Core's controlled setters can reject a native edit without changing its
 * snapshot. Reconcile after the queued change callback and React's commit,
 * including the core context effect, even when that snapshot did not change.
 */
export function useNativeInputSync() {
  const [, invalidate] = useReducer(value => value + 1, 0)
  const pending = useRef(new Map<NativeInput, () => void>())
  const generation = useRef(0)

  useEffect(() => () => {
    generation.current++
    pending.current.clear()
  }, [])

  useEffect(() => {
    const updates = Array.from(pending.current)
    pending.current.clear()
    for (const [input, reconcile] of updates) {
      if (input.isConnected)
        reconcile()
    }
  })

  return (input: NativeInput, reconcile: () => void) => {
    const currentGeneration = generation.current
    // useEvent({ sync: true }) queues the parent callback first. Scheduling our
    // render afterward lets accepted updates commit in the same batch.
    queueMicrotask(() => {
      if (generation.current !== currentGeneration || !input.isConnected)
        return
      pending.current.set(input, reconcile)
      invalidate()
    })
  }
}

export function useNativeInputValueSync(
  getValue: () => string | undefined,
  composing: RefObject<NativeInput | null>,
  getCommittedValue?: () => string | undefined,
) {
  const schedule = useNativeInputSync()
  const sync = (input: NativeInput, read = getValue) => schedule(input, () => {
    if (composing.current === input)
      return
    const value = read() ?? ''
    if (input.value === value)
      return
    const { selectionStart, selectionEnd, selectionDirection } = input
    input.value = value
    if (selectionStart !== null && selectionEnd !== null)
      input.setSelectionRange(selectionStart, selectionEnd, selectionDirection ?? undefined)
  })

  return (props: NativeInputProps, eventName: 'onInput' | 'onChange') => {
    const onEdit = (event: InputEditEvent | ChangeEditEvent) => {
      const input = event.currentTarget
      // Some browsers expose isComposing before React's composition callback.
      if ((event.nativeEvent as InputEvent).isComposing)
        composing.current = input
      if (eventName === 'onInput')
        props.onInput?.(event as InputEditEvent)
      else
        props.onChange?.(event as ChangeEditEvent)
      sync(input)
    }
    return {
      ...props,
      onInput(event: InputEditEvent) {
        if (eventName === 'onChange')
          props.onInput?.(event)
        onEdit(event)
      },
      // Core's imperative accepted writeback bypasses React's value tracker.
      // An ensuing input can therefore have no synthetic onChange. Use the
      // native input path, while retaining change-only events without doubling
      // the request when React dispatches both handlers for the same input.
      onChange: eventName === 'onChange'
        ? (event: ChangeEditEvent) => {
            if (event.nativeEvent.type !== 'input')
              onEdit(event)
          }
        : props.onChange,
      onCompositionStart(event: CompositionEvent<HTMLInputElement>) {
        composing.current = event.currentTarget
        props.onCompositionStart?.(event)
      },
      onCompositionEnd(event: CompositionEvent<HTMLInputElement>) {
        composing.current = null
        props.onCompositionEnd?.(event)
        sync(event.currentTarget)
      },
      onBlur(event: FocusEvent<HTMLInputElement>) {
        const wasComposing = composing.current === event.currentTarget
        composing.current = null
        props.onBlur?.(event)
        if (wasComposing || getCommittedValue)
          sync(event.currentTarget, getCommittedValue ?? getValue)
      },
      onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        props.onKeyDown?.(event)
        // NumberInput commits formatting on Enter as well as blur. A veto can
        // leave its raw value unchanged, so no core watcher restores the DOM.
        if (getCommittedValue && event.key === 'Enter' && !event.defaultPrevented
          && !props.readOnly && !event.nativeEvent.isComposing && !composing.current?.isConnected) {
          sync(event.currentTarget, getCommittedValue)
        }
      },
    }
  }
}

/**
 * Keep NumberInput's deferred formatting/cursor behavior, but guard the write
 * itself: a composition or node replacement can start after it was scheduled.
 */
export function useDeferredInputValue(composing: RefObject<NativeInput | null>) {
  const cancel = useRef<(() => void) | undefined>(undefined)
  useEffect(() => () => cancel.current?.(), [])

  return (input: HTMLInputElement, value: string) => {
    cancel.current?.()
    const focused = input.ownerDocument.activeElement === input
    const start = focused ? input.selectionStart : null
    const end = focused ? input.selectionEnd : null
    const before = input.value.slice(0, start ?? 0)
    const after = input.value.slice(end ?? input.value.length)
    cancel.current = raf(() => {
      if (!input.isConnected || composing.current === input)
        return
      const changed = input.value !== value
      setElementValue(input, value)
      if (!changed || input.ownerDocument.activeElement !== input || input.selectionStart === null)
        return
      // Match core's caret anchoring when a formatter inserts/removes text.
      let position = value.length
      if (value.endsWith(after)) {
        position = value.length - after.length
      }
      else if (value.startsWith(before)) {
        position = before.length
      }
      else if (start !== null) {
        const index = value.indexOf(before[start - 1], start - 1)
        if (index !== -1)
          position = index + 1
      }
      input.setSelectionRange(position, position)
    })
  }
}
