export { checkboxAnatomy } from './anatomy'

export { default as CheckboxContext, type CheckboxContextProps } from './components/Context.vue'
export {
  default as CheckboxControl,
  type CheckboxControlProps,
} from './components/Control.vue'
export { default as CheckboxGroup, type CheckboxGroupProps } from './components/Group.vue'
export {
  default as CheckboxHiddenInput,
  type CheckboxHiddenInputProps,
} from './components/HiddenInput.vue'
export {
  default as CheckboxIndicator,
  type CheckboxIndicatorProps,
} from './components/Indicator.vue'
export { default as CheckboxLabel, type CheckboxLabelProps } from './components/Label.vue'
export {
  default as CheckboxRoot,
  type CheckboxRootEmits,
  type CheckboxRootProps,
} from './components/Root.vue'
export {
  default as CheckboxRootProvider,
  type CheckboxRootProviderProps,
} from './components/RootProvider.vue'

export { useCheckbox, type UseCheckboxProps, type UseCheckboxReturn } from './composables/use-checkbox'
export { useCheckboxContext, type UseCheckboxContext } from './composables/use-checkbox-context'
export { useCheckboxGroup, type UseCheckboxGroupProps, type UseCheckboxGroupReturn } from './composables/use-checkbox-group'
export { useCheckboxGroupContext, type UseCheckboxGroupContext } from './composables/use-checkbox-group-context'

export type {
  CheckedChangeDetails as CheckboxCheckedChangeDetails,
  CheckedState as CheckboxCheckedState,
} from '@destyler/checkbox'
