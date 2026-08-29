export { fieldsetAnatomy } from './anatomy'
export { default as FieldsetContext, type FieldsetContextProps } from './components/Context.svelte'
export {
  default as FieldsetErrorText,
  type FieldsetErrorTextBaseProps,
  type FieldsetErrorTextProps,
} from './components/ErrorText.svelte'
export {
  default as FieldsetHelperText,
  type FieldsetHelperTextBaseProps,
  type FieldsetHelperTextProps,
} from './components/HelperText.svelte'
export {
  default as FieldsetLegend,
  type FieldsetLegendBaseProps,
  type FieldsetLegendProps,
} from './components/Legend.svelte'
export { default as FieldsetRoot, type FieldsetRootBaseProps, type FieldsetRootProps } from './components/Root.svelte'
export {
  default as FieldsetRootProvider,
  type FieldsetRootProviderBaseProps,
  type FieldsetRootProviderProps,
} from './components/RootProvider.svelte'
export { useFieldsetContext, type UseFieldsetContext } from './hooks/use-fieldset-context'
export { useFieldset, type UseFieldsetProps, type UseFieldsetReturn } from './hooks/use-fieldset.svelte'

export * as Fieldset from './namespace'
