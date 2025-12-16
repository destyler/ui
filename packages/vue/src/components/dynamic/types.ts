import type * as dynamic from '@destyler/dynamic'

export interface RootProps {
  /**
   * Whether to add a tag when you paste values into the dynamic
   * @default false
   */
  addOnPaste?: boolean
  /**
   * Whether to allow tags to exceed max. In this case,
   * we'll attach `data-invalid` to the root
   */
  allowOverflow?: boolean
  /**
   * Whether the input should be auto-focused
   */
  autoFocus?: boolean
  /**
   * The behavior of the dynamic when the input is blurred
   * - `"add"`: add the input value as a new tag
   * - `"clear"`: clear the input value
   */
  blurBehavior?: 'clear' | 'add'
  /**
   * The initial value of the dynamic when it is first rendered.
   * Use when you do not need to control the state of the dynamic.
   */
  defaultValue?: string[]
  /**
   * The character that serves has:
   * - event key to trigger the addition of a new tag
   * - character used to split tags when pasting into the input
   *
   * @default ","
   */
  delimiter?: string | RegExp
  /**
   * Whether the dynamic should be disabled
   */
  disabled?: boolean
  /**
   * Whether a tag can be edited after creation, by pressing `Enter` or double clicking.
   * @default true
   */
  editable?: boolean
  /**
   * The associate form of the underlying input element.
   */
  form?: string
  /**
   * The unique identifier of the machine.
   */
  id?: string
  /**
   * The ids of the elements in the dynamic. Useful for composition.
   */
  ids?: Partial<{
    root: string
    input: string
    hiddenInput: string
    clearBtn: string
    label: string
    control: string
    item: (opts: dynamic.ItemProps) => string
    itemDeleteTrigger: (opts: dynamic.ItemProps) => string
    itemInput: (opts: dynamic.ItemProps) => string
  }>
  /**
   * The dynamic's value
   */
  inputValue?: string
  /**
   * Whether the dynamic is invalid
   */
  invalid?: boolean
  /**
   * The max number of tags
   * @default Infinity
   */
  max?: number
  /**
   * The max length of the input.
   */
  maxLength?: number
  modelValue?: string[]
  /**
   * The name attribute for the input. Useful for form submissions
   */
  name?: string
  /**
   * Whether the dynamic should be read-only
   */
  readOnly?: boolean
  /**
   * Whether the dynamic is required
   */
  required?: boolean
  /**
   * Specifies the localized strings that identifies the accessibility elements and their states
   */
  translations?: dynamic.IntlTranslations
  /**
   * Returns a boolean that determines whether a tag can be added.
   * Useful for preventing duplicates or invalid tag values.
   */
  validate?: (details: dynamic.ValidateArgs) => boolean
}

export interface RootEmits {
  /**
   * Function called when the focus is moved outside the component
   */
  "focusOutside": [event: dynamic.FocusOutsideEvent]
  /**
   * Callback fired when a tag is highlighted by pointer or keyboard navigation
   */
  "highlightChange": [details: dynamic.HighlightChangeDetails]
  /**
   * Callback fired when the input value is updated
   */
  "inputValueChange": [details: dynamic.InputValueChangeDetails]
  /**
   * Function called when an interaction happens outside the component
   */
  "interactOutside": [event: dynamic.InteractOutsideEvent]
  /**
   * Function called when the pointer is pressed down outside the component
   */
  "pointerDownOutside": [event: dynamic.PointerDownOutsideEvent]
  /**
   * Callback fired when the tag values is updated
   */
  "valueChange": [details: dynamic.ValueChangeDetails]
  /**
   * Callback fired when the max tag count is reached or the `validateTag` function returns `false`
   */
  "valueInvalid": [details: dynamic.ValidityChangeDetails]
  /**
   * The callback fired when the model value changes.
   */
  'update:modelValue': [value: string[]]
}
