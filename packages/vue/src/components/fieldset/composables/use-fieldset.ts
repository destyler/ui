import type { FieldsetHTMLAttributes, HTMLAttributes } from 'vue'
import { getWindow } from '@destyler/dom'
import {
  computed,
  reactive,
  ref,
  useId,
  watchEffect,
} from 'vue'
import { parts } from '../anatomy'

export interface UseFieldsetProps {
  /**
   * The id of the fieldset.
   */
  id?: string
  /**
   * Indicates whether the fieldset is disabled.
   */
  disabled?: boolean | 'true' | 'false'
  /**
   * Indicates whether the fieldset is invalid.
   */
  invalid?: boolean
}

export type UseFieldsetReturn = ReturnType<typeof useFieldset>

export function useFieldset(props: UseFieldsetProps) {
  const state = reactive({
    hasErrorText: false,
    hasHelperText: false,
  })

  const uid = useId()
  const id = computed(() => props.id ?? uid)
  const rootRef = ref<Element | null>(null)
  const errorTextId = computed(() => `fieldset::${id.value}::error-text`)
  const helperTextId = computed(() => `fieldset::${id.value}::helper-text`)
  const labelId = computed(() => `fieldset::${id.value}::label`)

  watchEffect((onCleanup) => {
    const rootNode = rootRef.value
    if (!rootNode)
      return

    const win = getWindow(rootNode)
    const doc = win.document

    const checkTextElements = () => {
      state.hasErrorText = !!doc.getElementById(errorTextId.value)
      state.hasHelperText = !!doc.getElementById(helperTextId.value)
    }

    checkTextElements()
    const observer = new win.MutationObserver(checkTextElements)

    observer.observe(rootNode, { childList: true, subtree: true })

    onCleanup(() => {
      observer.disconnect()
    })
  }, { flush: 'post' })

  const labelIds = computed(() => {
    const ids: string[] = []
    if (state.hasErrorText && props.invalid)
      ids.push(errorTextId.value)
    if (state.hasHelperText)
      ids.push(helperTextId.value)
    return ids
  })

  const getRootProps = () =>
    ({
      ...parts.root.attrs,
      'disabled': props.disabled,
      'data-disabled': props.disabled ? 'true' : undefined,
      'data-invalid': props.invalid ? 'true' : undefined,
      'aria-describedby': labelIds.value.join(' '),
    }) as FieldsetHTMLAttributes

  const getLegendProps = () => ({
    'id': labelId.value,
    ...parts.legend.attrs,
    'data-disabled': props.disabled ? 'true' : undefined,
    'data-invalid': props.invalid ? 'true' : undefined,
  })

  const getHelperTextProps = () => ({
    id: helperTextId.value,
    ...parts.helperText.attrs,
  })

  const getErrorTextProps = (): HTMLAttributes => ({
    'id': errorTextId.value,
    ...parts.errorText.attrs,
    'aria-live': 'polite',
  })

  return computed(() => ({
    refs: {
      rootRef,
    },
    disabled: props.disabled,
    invalid: props.invalid,
    getRootProps,
    getLegendProps,
    getHelperTextProps,
    getErrorTextProps,
  }))
}
