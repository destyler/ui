export { splitterAnatomy } from './anatomy'
export { SplitterContext, type SplitterContextProps } from './components/Context'
export {
  SplitterPanel,
  type SplitterPanelBaseProps,
  type SplitterPanelProps,
} from './components/Panel'
export {
  SplitterResizeTrigger,
  type SplitterResizeTriggerBaseProps,
  type SplitterResizeTriggerProps,
} from './components/ResizeTrigger'
export { SplitterRoot, type SplitterRootBaseProps, type SplitterRootProps } from './components/Root'
export {
  SplitterRootProvider,
  type SplitterRootProviderBaseProps,
  type SplitterRootProviderProps,
} from './components/RootProvider'
export { useSplitter, type UseSplitterProps, type UseSplitterReturn } from './hooks/use-splitter'
export { useSplitterContext, type UseSplitterContext } from './hooks/use-splitter-context'
export * as Splitter from './namespace'

export type { SizeChangeDetails as SplitterSizeChangeDetails } from '@destyler/splitter'
