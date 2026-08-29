export { splitterAnatomy } from './anatomy'
export { default as SplitterContext, type SplitterContextProps } from './components/Context.svelte'
export { default as SplitterPanel, type SplitterPanelBaseProps, type SplitterPanelProps } from './components/Panel.svelte'
export {
  default as SplitterResizeTrigger,
  type SplitterResizeTriggerBaseProps,
  type SplitterResizeTriggerProps,
} from './components/ResizeTrigger.svelte'
export { default as SplitterRoot, type SplitterRootBaseProps, type SplitterRootProps } from './components/Root.svelte'
export {
  default as SplitterRootProvider,
  type SplitterRootProviderBaseProps,
  type SplitterRootProviderProps,
} from './components/RootProvider.svelte'
export { useSplitterContext, type UseSplitterContext } from './hooks/use-splitter-context'
export { useSplitter, type UseSplitterProps, type UseSplitterReturn } from './hooks/use-splitter.svelte'
export * as Splitter from './namespace'

export type {
  PanelSizeData as SplitterPanelSizeData,
  SizeChangeDetails as SplitterSizeChangeDetails,
} from '@destyler/splitter'
