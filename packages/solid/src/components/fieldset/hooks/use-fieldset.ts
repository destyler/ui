import { getWindow } from '@destyler/dom'
import { mergeProps } from '@destyler/solid'
import { createEffect, createMemo, createSignal, createUniqueId, onCleanup } from 'solid-js'
import { parts } from '../anatomy'

type Booleanish = boolean | 'true' | 'false'

function dataAttr(condition: boolean | undefined) {
  return (condition ? '' : undefined) as Booleanish
}

export interface UseFieldsetProps {
  /**
   * The id of the fieldset.
   */
  id?: string
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

export function useFieldset(props: UseFieldsetProps) {
  const fieldsetProps = mergeProps({ disabled: false, invalid: false }, props)
  const [rootRef, setRootRef] = createSignal<HTMLFieldSetElement>()
  const id = props.id ?? createUniqueId()

  const errorTextId = `fieldset::${id}::error-text`
  const helperTextId = `fieldset::${id}::helper-text`

  const [hasErrorText, setHasErrorText] = createSignal(false)
  const [hasHelperText, setHasHelperText] = createSignal(false)

  createEffect(() => {
    const rootNode = rootRef()
    if (!rootNode)
      return

    const win = getWindow(rootNode)
    const doc = win.document

    const checkTextElements = () => {
      setHasErrorText(!!doc.getElementById(errorTextId))
      setHasHelperText(!!doc.getElementById(helperTextId))
    }

    checkTextElements()
    const observer = new win.MutationObserver(checkTextElements)
    observer.observe(rootNode, { childList: true, subtree: true })

    onCleanup(() => observer.disconnect())
  })

  const ariaDescribedby = createMemo(() => {
    const labelIds: string[] = []
    if (hasErrorText() && fieldsetProps.invalid)
      labelIds.push(errorTextId)
    if (hasHelperText())
      labelIds.push(helperTextId)
    return labelIds.join(' ') || undefined
  })

  const getRootProps = () => ({
    ...parts.root.attrs,
    'ref': setRootRef,
    'disabled': fieldsetProps.disabled,
    'data-disabled': dataAttr(fieldsetProps.disabled),
    'data-invalid': dataAttr(fieldsetProps.invalid),
    'aria-describedby': ariaDescribedby(),
  })

  const getLegendProps = () => ({
    ...parts.legend.attrs,
    'data-disabled': dataAttr(fieldsetProps.disabled),
    'data-invalid': dataAttr(fieldsetProps.invalid),
  })

  const getHelperTextProps = () => ({
    id: helperTextId,
    ...parts.helperText.attrs,
  })

  const getErrorTextProps = () => ({
    'id': errorTextId,
    ...parts.errorText.attrs,
    'aria-live': 'polite',
  })

  return createMemo(() => ({
    refs: {
      rootRef: rootRef(),
    },
    setRootRef,
    disabled: fieldsetProps.disabled,
    invalid: fieldsetProps.invalid,
    getRootProps,
    getLegendProps,
    getHelperTextProps,
    getErrorTextProps,
  }))
}
