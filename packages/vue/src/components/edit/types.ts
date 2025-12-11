import type * as edit from '@destyler/edit'

export interface RootProps {
  /**
   * The activation mode for the preview element.
   *
   * - "focus" - Enter edit mode when the preview is focused
   * - "dblclick" - Enter edit mode when the preview is double-clicked
   * - "click" - Enter edit mode when the preview is clicked
   *
   * @default "focus"
   */
  activationMode?: edit.ActivationMode
  /**
   * Whether the edit should auto-resize to fit the content.
   */
  autoResize?: boolean
  /**
   * The initial edit state of the edit when it is first rendered.
   * Use when you do not need to control its edit state.
   */
  defaultEdit?: boolean
  /**
   * The initial value of the edit when it is first rendered.
   * Use when you do not need to control the state of the edit.
   */
  defaultValue?: string
  /**
   * Whether the edit is disabled
   */
  disabled?: boolean
  /**
   * Whether the edit is in edit mode.
   */
  edit?: boolean
  /**
   * The element that should receive focus when the edit is closed.
   * By default, it will focus on the trigger element.
   */
  finalFocusEl?: () => HTMLElement | null
  /**
   * The associate form of the underlying input.
   */
  form?: string
  /**
   * The unique identifier of the machine.
   */
  id?: string
  /**
   * The ids of the elements in the edit. Useful for composition.
   */
  ids?: Partial<{
    root: string
    area: string
    label: string
    preview: string
    input: string
    control: string
    submitTrigger: string
    cancelTrigger: string
    editTrigger: string
  }>
  /**
   * Whether the input's value is invalid.
   */
  invalid?: boolean
  /**
   * The maximum number of characters allowed in the edit
   */
  maxLength?: number
  modelValue?: string
  /**
   * The name attribute of the edit component. Used for form submission.
   */
  name?: string
  /**
   * The placeholder value to show when the `value` is empty
   */
  placeholder?: string | { edit: string, preview: string }
  /**
   * Whether the edit is readonly
   */
  readOnly?: boolean
  /**
   * Whether the edit is required
   */
  required?: boolean
  /**
   * Whether to select the text in the input when it is focused.
   * @default true
   */
  selectOnFocus?: boolean
  /**
   * The action that triggers submit in the edit mode:
   *
   * - "enter" - Trigger submit when the enter key is pressed
   * - "blur" - Trigger submit when the edit is blurred
   * - "none" - No action will trigger submit. You need to use the submit button
   * - "both" - Pressing `Enter` and blurring the input will trigger submit
   *
   * @default "both"
   */
  submitMode?: edit.SubmitMode
  /**
   * Specifies the localized strings that identifies the accessibility elements and their states
   */
  translations?: edit.IntlTranslations
}

export interface RootEmits {
  /**
   * The callback that is called when the edit mode is changed
   */
  'editChange': [details: edit.EditChangeDetails]
  /**
   * Function called when the focus is moved outside the component
   */
  'focusOutside': [event: edit.FocusOutsideEvent]
  /**
   * Function called when an interaction happens outside the component
   */
  'interactOutside': [event: edit.InteractOutsideEvent]
  /**
   * Function called when the pointer is pressed down outside the component
   */
  'pointerDownOutside': [event: edit.PointerDownOutsideEvent]
  /**
   * The callback that is called when the edit's value is changed
   */
  'valueChange': [details: edit.ValueChangeDetails]
  /**
   * The callback that is called when the edit's value is submitted.
   */
  'valueCommit': [details: edit.ValueChangeDetails]
  /**
   * The callback that is called when the esc key is pressed or the cancel button is clicked
   */
  'valueRevert': [details: edit.ValueChangeDetails]
  /**
   * The callback fired when the model value changes.
   */
  'update:modelValue': [value: string]
  /**
   * Event handler called when the edit state of the combobox changes.
   */
  'update:edit': [edit: boolean]
}
