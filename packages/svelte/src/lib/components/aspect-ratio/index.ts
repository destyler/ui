export { aspectRatioAnatomy } from './anatomy'
export {
  default as AspectRatioContent,
  type AspectRatioContentBaseProps,
  type AspectRatioContentProps,
} from './components/Content.svelte'
export { default as AspectRatioContext, type AspectRatioContextProps } from './components/Context.svelte'
export {
  default as AspectRatioRoot,
  type AspectRatioRootBaseProps,
  type AspectRatioRootProps,
} from './components/Root.svelte'
export {
  default as AspectRatioRootProvider,
  type AspectRatioRootProviderBaseProps,
  type AspectRatioRootProviderProps,
} from './components/RootProvider.svelte'
export { useAspectRatioContext, type UseAspectRatioContext } from './hooks/use-aspect-ratio-context'
export { useAspectRatio, type UseAspectRatioProps, type UseAspectRatioReturn } from './hooks/use-aspect-ratio.svelte'

export * as AspectRatio from './namespace'
