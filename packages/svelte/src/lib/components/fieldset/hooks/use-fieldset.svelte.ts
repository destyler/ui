import type { HTMLProps } from '$lib/types'
import type { MaybeFunction } from '@destyler/utils'
import { resolveQueryRoot } from '$lib/utils/resolve-query-root'
import { dataAttr, getWindow } from '@destyler/dom'
import { runIfFn } from '@destyler/utils'
import { onMount } from 'svelte'
import { parts } from '../anatomy'

export interface UseFieldsetProps {
  /**
   * A stable id for the fieldset.
   *
   * Svelte hooks cannot call `$props.id()`. Components should pass the id
   * generated at the component's top level; `Fieldset.Root` does this
   * automatically.
   */
  id: string
  /**
   * Indicates whether the fieldset is disabled.
   */
  disabled?: boolean
  /**
   * Indicates whether the fieldset is invalid.
   */
  invalid?: boolean
}

export type UseFieldsetReturn = ReturnType<typeof useFieldset>

export function useFieldset(inProps: MaybeFunction<UseFieldsetProps>) {
  const props = $derived.by<UseFieldsetProps>(() => {
    const resolvedProps = runIfFn(inProps)
    return resolvedProps
  })

  const id = $derived(props.id)

  const disabled = $derived(props.disabled ?? false)
  const invalid = $derived(props.invalid ?? false)

  let hasErrorText = $state(false)
  let hasHelperText = $state(false)

  let rootRef = $state<Element | null>(null)
  const setRootRef = (el: Element | null) => {
    rootRef = el
  }

  const errorTextId = $derived(`fieldset::${id}::error-text`)
  const helperTextId = $derived(`fieldset::${id}::helper-text`)

  const checkTextElements = () => {
    if (!rootRef)
      return
    const queryRoot = resolveQueryRoot(rootRef.getRootNode(), rootRef.ownerDocument)
    hasErrorText = !!queryRoot.getElementById(errorTextId)
    hasHelperText = !!queryRoot.getElementById(helperTextId)
  }

  onMount(() => {
    checkTextElements()

    if (rootRef) {
      const win = getWindow(rootRef)
      const observer = new win.MutationObserver(checkTextElements)
      observer.observe(rootRef, { childList: true, subtree: true })

      return () => observer.disconnect()
    }
  })

  const labelIds = $derived(() => {
    const ids: string[] = []
    if (hasErrorText && invalid)
      ids.push(errorTextId)
    if (hasHelperText)
      ids.push(helperTextId)
    return ids.join(' ') || undefined
  })

  const getRootProps = () =>
    ({
      ...parts.root.attrs,
      disabled,
      'data-disabled': dataAttr(disabled),
      'data-invalid': dataAttr(invalid),
      'aria-describedby': labelIds(),
    }) as HTMLProps<'fieldset'>

  const getLegendProps = () =>
    ({
      ...parts.legend.attrs,
      'data-disabled': dataAttr(disabled),
      'data-invalid': dataAttr(invalid),
    }) as HTMLProps<'legend'>

  const getHelperTextProps = () =>
    ({
      id: helperTextId,
      ...parts.helperText.attrs,
    }) as HTMLProps<'span'>

  const getErrorTextProps = () =>
    ({
      'id': errorTextId,
      ...parts.errorText.attrs,
      'aria-live': 'polite',
    }) as HTMLProps<'span'>

  const api = $derived({
    setRootRef,
    disabled,
    invalid,
    getRootProps,
    getLegendProps,
    getHelperTextProps,
    getErrorTextProps,
  })

  return () => api
}
