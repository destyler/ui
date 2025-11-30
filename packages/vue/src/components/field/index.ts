export { fieldAnatomy } from './anatomy'
export { default as FieldContext, type FieldContextProps } from './components/Context.vue'
export {
  default as FieldErrorText,
  type FieldErrorTextProps,
} from './components/ErrorText.vue'
export {
  default as FieldHelperText,
  type FieldHelperTextProps,
} from './components/HelperText.vue'
export { default as FieldInput, type FieldInputProps } from './components/Input.vue'
export { default as FieldLabel, type FieldLabelProps } from './components/Label.vue'
export {
  default as FieldRequiredIndicator,
  type FieldRequiredIndicatorProps,
} from './components/RequiredIndicator.vue'
export { default as FieldRoot, type FieldRootProps } from './components/Root.vue'
export {
  default as FieldRootProvider,
  type FieldRootProviderProps,
} from './components/RootProvider.vue'
export { default as FieldSelect, type FieldSelectBaseProps, type FieldSelectProps } from './components/Select.vue'
export { default as FieldTextarea, type FieldTextareaBaseProps, type FieldTextareaProps } from './components/Textarea.vue'
export { useFieldContext, type UseFieldContext } from './composables/use-field-context'

export * as Field from './namespace'
