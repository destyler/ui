import type { UseFieldsetReturn } from '~/components/fieldset/hooks/use-fieldset'
import { ariaAttr, dataAttr, getWindow } from '@destyler/dom'
import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  mergeProps,
  onCleanup,
} from 'solid-js'
import { useFieldsetContext } from '~/components/fieldset'
import { parts } from '../anatomy'

export interface ElementIds {
  root?: string
  control?: string
  label?: string
  errorText?: string
  helperText?: string
}

export interface UseFieldProps {
  /**
   * The id of the field.
   */
  id?: string
  /**
   * The ids of the field parts.
   */
  ids?: ElementIds
  /**
   * Indicates whether the field is required.
   */
  required?: boolean
  /**
   * Indicates whether the field is disabled.
   */
  disabled?: boolean
  /**
   * Indicates whether the field is invalid.
   */
  invalid?: boolean
  /**
   * Indicates whether the field is read-only.
   */
  readOnly?: boolean
}

export type UseFieldReturn = ReturnType<typeof useField>

export function useField(props: UseFieldProps) {
  const fieldset: UseFieldsetReturn | undefined = useFieldsetContext()

  const fieldProps = mergeProps(
    () => ({
      disabled: Boolean(fieldset?.().disabled),
      required: false,
      invalid: false,
      readOnly: false,
    }),
    props,
  )

  const [hasErrorText, setHasErrorText] = createSignal(false)
  const [hasHelperText, setHasHelperText] = createSignal(false)

  const generatedId = createUniqueId()
  const id = createMemo(() => fieldProps.id ?? generatedId)
  const [rootRef, setRootRef] = createSignal<HTMLDivElement>()

  const rootId = createMemo(() => fieldProps.ids?.root ?? `field::${id()}`)
  const controlId = createMemo(() => fieldProps.ids?.control ?? id())
  const errorTextId = createMemo(() => fieldProps.ids?.errorText ?? `field::${id()}::error-text`)
  const helperTextId = createMemo(() => fieldProps.ids?.helperText ?? `field::${id()}::helper-text`)
  const labelId = createMemo(() => fieldProps.ids?.label ?? `field::${id()}::label`)

  createEffect(() => {
    const rootNode = rootRef()
    if (!rootNode)
      return

    const win = getWindow(rootNode)
    const doc = win.document

    const checkTextElements = () => {
      setHasErrorText(!!doc.getElementById(errorTextId()))
      setHasHelperText(!!doc.getElementById(helperTextId()))
    }

    checkTextElements()
    const observer = new win.MutationObserver(checkTextElements)

    observer.observe(rootNode, { childList: true, subtree: true })

    onCleanup(() => observer.disconnect())
  })

  const getRootProps = () => ({
    ...parts.root.attrs,
    'id': rootId(),
    'ref': setRootRef,
    'role': 'group',
    'data-disabled': dataAttr(fieldProps.disabled),
    'data-invalid': dataAttr(fieldProps.invalid),
    'data-readonly': dataAttr(fieldProps.readOnly),
  })

  const getLabelProps = () => ({
    ...parts.label.attrs,
    'id': labelId(),
    'data-disabled': dataAttr(fieldProps.disabled),
    'data-invalid': dataAttr(fieldProps.invalid),
    'data-readonly': dataAttr(fieldProps.readOnly),
    'htmlFor': controlId(),
  })

  const ariaDescribedby = createMemo(() => {
    const labelIds: string[] = []
    if (hasErrorText() && fieldProps.invalid)
      labelIds.push(errorTextId())
    if (hasHelperText())
      labelIds.push(helperTextId())
    return labelIds.join(' ') || undefined
  })

  const getControlProps = () => ({
    'aria-describedby': ariaDescribedby(),
    'aria-invalid': ariaAttr(fieldProps.invalid),
    'data-invalid': dataAttr(fieldProps.invalid),
    'data-required': dataAttr(fieldProps.required),
    'data-readonly': dataAttr(fieldProps.readOnly),
    'id': controlId(),
    'required': fieldProps.required,
    'disabled': fieldProps.disabled,
    'readOnly': fieldProps.readOnly || undefined,
  })

  const getInputProps = () => ({
    ...getControlProps(),
    ...parts.input.attrs,
  })

  const getTextareaProps = () => ({
    ...getControlProps(),
    ...parts.textarea.attrs,
  })

  const getSelectProps = () => ({
    ...getControlProps(),
    ...parts.select.attrs,
  })

  const getHelperTextProps = () => ({
    'id': helperTextId(),
    ...parts.helperText.attrs,
    'data-disabled': dataAttr(fieldProps.disabled),
  })

  const getErrorTextProps = () => ({
    'id': errorTextId(),
    ...parts.errorText.attrs,
    'aria-live': 'polite',
  })

  const getRequiredIndicatorProps = () => ({
    'aria-hidden': true,
    ...parts.requiredIndicator.attrs,
  })

  return createMemo(() => ({
    ariaDescribedby: ariaDescribedby(),
    ids: {
      root: rootId(),
      control: controlId(),
      label: labelId(),
      errorText: errorTextId(),
      helperText: helperTextId(),
    },
    refs: {
      rootRef: rootRef(),
    },
    setRootRef,
    disabled: fieldProps.disabled,
    invalid: fieldProps.invalid,
    readOnly: fieldProps.readOnly,
    required: fieldProps.required,
    getLabelProps,
    getRootProps,
    getInputProps,
    getTextareaProps,
    getSelectProps,
    getHelperTextProps,
    getErrorTextProps,
    getRequiredIndicatorProps,
  }))
}
