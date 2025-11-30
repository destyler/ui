import type * as checkbox from '@destyler/checkbox'

export interface RootProps {
  /**
   * The checked state of the checkbox
   */
  checked?: checkbox.CheckedState
  /**
   * The checked state of the checkbox when it is first rendered.
   * Use this when you do not need to control the state of the checkbox.
   */
  defaultChecked?: checkbox.CheckedState
  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean
  /**
   * The id of the form that the checkbox belongs to.
   */
  form?: string
  /**
   * The unique identifier of the machine.
   */
  id?: string
  /**
   * The ids of the elements in the checkbox. Useful for composition.
   */
  ids?: Partial<{ root: string, hiddenInput: string, control: string, label: string }>
  /**
   * Whether the checkbox is invalid
   */
  invalid?: boolean
  /**
   * The name of the input field in a checkbox.
   * Useful for form submission.
   */
  name?: string
  /**
   * Whether the checkbox is read-only
   */
  readOnly?: boolean
  /**
   * Whether the checkbox is required
   */
  required?: boolean
  /**
   * The value of checkbox input. Useful for form submission.
   * @default "on"
   */
  value?: string
}

export interface RootEmits {
  /**
   * The callback invoked when the checked state changes.
   */
  'checkedChange': [details: checkbox.CheckedChangeDetails]

  'update:checked': [checked: checkbox.CheckedState]
}

export interface GroupProps {
  /**
   * The initial value of `value` when uncontrolled
   */
  defaultValue?: string[]
  /**
   * The controlled value of the checkbox group
   */
  modelValue?: string[]
  /**
   * If `true`, the checkbox group is disabled
   */
  disabled?: boolean
  /**
   * If `true`, the checkbox group is read-only
   */
  readOnly?: boolean
  /**
   * The name of the input fields in the checkbox group
   * (Useful for form submission).
   */
  name?: string
  /**
   * If `true`, the checkbox group is invalid
   */
  invalid?: boolean
}

export interface GroupEmits {
  /**
   * Functional called when the value changes.
   */
  valueChange: [value: string[]]
  'update:modelValue': [value: string[]]
}
