import type { MaybeFunction } from '@destyler/utils'
import { runIfFn } from '@destyler/utils'
import { untrack } from 'svelte'

export interface UseCheckboxGroupProps {
  /**
   * The initial value of `value` when uncontrolled
   */
  defaultValue?: string[]
  /**
   * The controlled value of the checkbox group
   */
  value?: string[]
  /**
   * The name of the input fields in the checkbox group
   * (Useful for form submission).
   */
  name?: string
  /**
   * The callback to call when the value changes
   */
  onValueChange?: (value: string[]) => void
  /**
   * If `true`, the checkbox group is disabled
   */
  disabled?: boolean
  /**
   * If `true`, the checkbox group is read-only
   */
  readOnly?: boolean
  /**
   * If `true`, the checkbox group is invalid
   */
  invalid?: boolean
}

export interface CheckboxGroupItemProps {
  value: string | undefined
}

export type UseCheckboxGroupReturn = ReturnType<typeof useCheckboxGroup>

export function useCheckboxGroup(props: MaybeFunction<UseCheckboxGroupProps> = {}) {
  const resolvedProps = $derived(runIfFn(props) || {})

  let valueState = $state<string[]>(untrack(() => resolvedProps.defaultValue) ?? [])
  const value = $derived(resolvedProps.value !== undefined ? resolvedProps.value : valueState)

  const interactive = $derived(!(resolvedProps.disabled || resolvedProps.readOnly))

  const setValue = (newValue: string[]) => {
    if (resolvedProps.value === undefined) {
      valueState = newValue
    }
    resolvedProps.onValueChange?.(newValue)
  }

  const isChecked = (val: string | undefined) => {
    return value.some(v => String(v) === String(val))
  }

  const addValue = (val: string) => {
    if (!interactive)
      return
    if (isChecked(val))
      return
    setValue(value.concat(val))
  }

  const removeValue = (val: string) => {
    if (!interactive)
      return
    setValue(value.filter(v => String(v) !== String(val)))
  }

  const toggleValue = (val: string) => {
    isChecked(val) ? removeValue(val) : addValue(val)
  }

  const getResolvedItemProps = (
    itemProps: CheckboxGroupItemProps,
    inheritedProps: Pick<UseCheckboxGroupProps, 'disabled' | 'readOnly' | 'invalid'> = {},
  ) => {
    return {
      checked: itemProps.value != null ? isChecked(itemProps.value) : undefined,
      onCheckedChange() {
        if (itemProps.value != null) {
          toggleValue(itemProps.value)
        }
      },
      name: resolvedProps.name,
      disabled: !!(resolvedProps.disabled ?? inheritedProps.disabled ?? false),
      readOnly: !!(resolvedProps.readOnly ?? inheritedProps.readOnly ?? false),
      invalid: !!(resolvedProps.invalid ?? inheritedProps.invalid ?? false),
    }
  }

  // Keep the original one-argument callback contract (including Array.map),
  // while compound checkboxes may supply the defaults of their own Field.
  function getItemProps(
    itemProps: CheckboxGroupItemProps,
    inheritedProps: Pick<UseCheckboxGroupProps, 'disabled' | 'readOnly' | 'invalid'>,
  ): ReturnType<typeof getResolvedItemProps>
  function getItemProps(itemProps: CheckboxGroupItemProps): ReturnType<typeof getResolvedItemProps>
  function getItemProps(
    itemProps: CheckboxGroupItemProps,
    inheritedProps: Pick<UseCheckboxGroupProps, 'disabled' | 'readOnly' | 'invalid'> = {},
  ) {
    return getResolvedItemProps(itemProps, typeof inheritedProps === 'object' && inheritedProps !== null ? inheritedProps : {})
  }

  const api = $derived({
    isChecked,
    value,
    name: resolvedProps.name,
    disabled: !!resolvedProps.disabled,
    readOnly: !!resolvedProps.readOnly,
    invalid: !!resolvedProps.invalid,
    setValue,
    addValue,
    toggleValue,
    getItemProps,
  })

  return () => api
}
