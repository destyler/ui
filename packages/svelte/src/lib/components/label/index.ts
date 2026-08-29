export { labelAnatomy } from './anatomy'
export { default as LabelContext, type LabelContextProps } from './components/Context.svelte'
export { default as LabelRoot, type LabelRootBaseProps, type LabelRootProps } from './components/Root.svelte'
export {
  default as LabelRootProvider,
  type LabelRootProviderBaseProps,
  type LabelRootProviderProps,
} from './components/RootProvider.svelte'
export { useLabelContext, type UseLabelContext } from './hooks/use-label-context'
export { useLabel, type UseLabelProps, type UseLabelReturn } from './hooks/use-label.svelte'
export * as Label from './namespace'
