import { useRef } from 'react'
import { useControllableState } from '~/hooks/use-controllable-state'
import { useEvent } from '~/hooks/use-event'
import { useSafeLayoutEffect } from '~/hooks/use-safe-layout-effect'

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

export function useCheckboxGroup(props: UseCheckboxGroupProps = {}) {
  const { defaultValue, value: controlledValue, onValueChange, disabled, readOnly, name, invalid } = props

  const interactive = !(disabled || readOnly)

  const onChangeProp = useEvent(onValueChange, { sync: true })

  const [value, setValue] = useControllableState({
    value: controlledValue,
    defaultValue: defaultValue || [],
    onChange: onChangeProp,
  })

  // React batches state updates, but multiple API operations in the same event
  // must build on each other. Only uncontrolled requests own this pending value;
  // controlled requests continue to derive from the parent's committed snapshot.
  const pendingValue = useRef(value)
  useSafeLayoutEffect(() => {
    pendingValue.current = value
  }, [value])

  const getValue = () => controlledValue === undefined ? pendingValue.current : value
  const setGroupValue = (next: string[]) => {
    if (controlledValue === undefined)
      pendingValue.current = next
    setValue(next)
  }
  const hasValue = (values: string[], val: string | undefined) => values.some(v => String(v) === String(val))
  const isChecked = (val: string | undefined) => hasValue(value, val)

  const addValue = (val: string) => {
    if (!interactive)
      return
    const currentValue = getValue()
    if (hasValue(currentValue, val))
      return
    setGroupValue(currentValue.concat(val))
  }

  const removeValue = (val: string) => {
    if (!interactive)
      return
    setGroupValue(getValue().filter(v => String(v) !== String(val)))
  }

  const toggleValue = (val: string) => {
    hasValue(getValue(), val) ? removeValue(val) : addValue(val)
  }

  const getItemProps = (props: CheckboxGroupItemProps) => {
    return {
      // Omit `checked` when the item has no value — presence of the key (even
      // undefined) makes Destyler 0.2.7 treat the checkbox as controlled.
      ...(props.value != null ? { checked: isChecked(props.value) } : {}),
      onCheckedChange() {
        if (props.value != null) {
          toggleValue(props.value)
        }
      },
      name,
      disabled,
      readOnly,
      invalid,
    }
  }

  return {
    isChecked,
    value,
    name,
    disabled: !!disabled,
    readOnly: !!readOnly,
    invalid: !!invalid,
    setValue: setGroupValue,
    addValue,
    toggleValue,
    getItemProps,
  }
}

export type UseCheckboxGroupReturn = ReturnType<typeof useCheckboxGroup>
