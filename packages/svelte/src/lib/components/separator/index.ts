export { separatorAnatomy } from './anatomy'
export { default as SeparatorContext, type SeparatorContextProps } from './components/Context.svelte'
export {
  default as SeparatorRoot,
  type SeparatorRootBaseProps,
  type SeparatorRootProps,
} from './components/Root.svelte'
export { default as SeparatorRootProvider, type SeparatorRootProviderProps } from './components/RootProvider.svelte'
export { useSeparatorContext, type UseSeparatorContext } from './hooks/use-separator-context'
export { useSeparator, type UseSeparatorProps, type UseSeparatorReturn } from './hooks/use-separator.svelte'
export * as Separator from './namespace'
