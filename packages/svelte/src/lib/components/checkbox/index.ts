export { checkboxAnatomy } from './anatomy'
export { default as CheckboxContext, type CheckboxContextProps } from './components/Context.svelte'
export {
  default as CheckboxControl,
  type CheckboxControlBaseProps,
  type CheckboxControlProps,
} from './components/Control.svelte'
export { default as CheckboxGroup, type CheckboxGroupBaseProps, type CheckboxGroupProps } from './components/Group.svelte'
export {
  default as CheckboxHiddenInput,
  type CheckboxHiddenInputBaseProps,
  type CheckboxHiddenInputProps,
} from './components/HiddenInput.svelte'
export {
  default as CheckboxIndicator,
  type CheckboxIndicatorBaseProps,
  type CheckboxIndicatorProps,
} from './components/Indicator.svelte'
export { default as CheckboxLabel, type CheckboxLabelBaseProps, type CheckboxLabelProps } from './components/Label.svelte'
export { default as CheckboxRoot, type CheckboxRootBaseProps, type CheckboxRootProps } from './components/Root.svelte'
export {
  default as CheckboxRootProvider,
  type CheckboxRootProviderBaseProps,
  type CheckboxRootProviderProps,
} from './components/RootProvider.svelte'
export { CheckboxProvider, useCheckboxContext } from './hooks/use-checkbox-context'
export type { UseCheckboxContext } from './hooks/use-checkbox-context'
export { CheckboxGroupProvider, useCheckboxGroupContext } from './hooks/use-checkbox-group-context'
export type { UseCheckboxGroupContext } from './hooks/use-checkbox-group-context'
export { useCheckboxGroup } from './hooks/use-checkbox-group.svelte'
export type { UseCheckboxGroupProps, UseCheckboxGroupReturn } from './hooks/use-checkbox-group.svelte'
export { useCheckbox } from './hooks/use-checkbox.svelte'
export type { UseCheckboxProps, UseCheckboxReturn } from './hooks/use-checkbox.svelte'
export * as Checkbox from './namespace'

export type {
  CheckedChangeDetails as CheckboxCheckedChangeDetails,
  CheckedState as CheckboxCheckedState,
} from '@destyler/checkbox'
