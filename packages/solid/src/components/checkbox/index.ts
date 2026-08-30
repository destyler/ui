export { checkboxAnatomy } from './anatomy'
export { CheckboxContext, type CheckboxContextProps } from './components/Context'
export {
  CheckboxControl,
  type CheckboxControlBaseProps,
  type CheckboxControlProps,
} from './components/Control'
export {
  CheckboxGroup,
  type CheckboxGroupBaseProps,
  type CheckboxGroupProps,
} from './components/Group'
export {
  CheckboxHiddenInput,
  type CheckboxHiddenInputBaseProps,
  type CheckboxHiddenInputProps,
} from './components/HiddenInput'
export {
  CheckboxIndicator,
  type CheckboxIndicatorBaseProps,
  type CheckboxIndicatorProps,
} from './components/Indicator'
export {
  CheckboxLabel,
  type CheckboxLabelBaseProps,
  type CheckboxLabelProps,
} from './components/Label'
export { CheckboxRoot, type CheckboxRootBaseProps, type CheckboxRootProps } from './components/Root'
export {
  CheckboxRootProvider,
  type CheckboxRootProviderBaseProps,
  type CheckboxRootProviderProps,
} from './components/RootProvider'
export { useCheckbox, type UseCheckboxProps, type UseCheckboxReturn } from './hooks/use-checkbox'
export { useCheckboxContext, type UseCheckboxContext } from './hooks/use-checkbox-context'
export {
  useCheckboxGroup,
  type UseCheckboxGroupProps,
  type UseCheckboxGroupReturn,
} from './hooks/use-checkbox-group'
export { useCheckboxGroupContext, type UseCheckboxGroupContext } from './hooks/use-checkbox-group-context'
export * as Checkbox from './namespace'

export type {
  CheckedChangeDetails as CheckboxCheckedChangeDetails,
  CheckedState as CheckboxCheckedState,
} from '@destyler/checkbox'
