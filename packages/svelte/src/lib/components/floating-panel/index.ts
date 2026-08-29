export { floatingPanelAnatomy } from './anatomy'
export {
  default as FloatingPanelBody,
  type FloatingPanelBodyBaseProps,
  type FloatingPanelBodyProps,
} from './components/Body.svelte'
export {
  default as FloatingPanelCloseTrigger,
  type FloatingPanelCloseTriggerBaseProps,
  type FloatingPanelCloseTriggerProps,
} from './components/CloseTrigger.svelte'
export {
  default as FloatingPanelContent,
  type FloatingPanelContentBaseProps,
  type FloatingPanelContentProps,
} from './components/Content.svelte'
export { default as FloatingPanelContext, type FloatingPanelContextProps } from './components/Context.svelte'
export {
  default as FloatingPanelDock,
  type FloatingPanelDockBaseProps,
  type FloatingPanelDockProps,
} from './components/Dock.svelte'
export {
  default as FloatingPanelDragTrigger,
  type FloatingPanelDragTriggerBaseProps,
  type FloatingPanelDragTriggerProps,
} from './components/DragTrigger.svelte'
export {
  default as FloatingPanelHeader,
  type FloatingPanelHeaderBaseProps,
  type FloatingPanelHeaderProps,
} from './components/Header.svelte'
export {
  default as FloatingPanelMaximizeTrigger,
  type FloatingPanelMaximizeTriggerBaseProps,
  type FloatingPanelMaximizeTriggerProps,
} from './components/MaximizeTrigger.svelte'
export {
  default as FloatingPanelMinimizeTrigger,
  type FloatingPanelMinimizeTriggerBaseProps,
  type FloatingPanelMinimizeTriggerProps,
} from './components/MinimizeTrigger.svelte'
export {
  default as FloatingPanelPositioner,
  type FloatingPanelPositionerBaseProps,
  type FloatingPanelPositionerProps,
} from './components/Positioner.svelte'
export {
  default as FloatingPanelResizeTrigger,
  type FloatingPanelResizeTriggerBaseProps,
  type FloatingPanelResizeTriggerProps,
} from './components/ResizeTrigger.svelte'
export {
  default as FloatingPanelRestoreTrigger,
  type FloatingPanelRestoreTriggerBaseProps,
  type FloatingPanelRestoreTriggerProps,
} from './components/RestoreTrigger.svelte'
export {
  default as FloatingPanelRoot,
  type FloatingPanelRootBaseProps,
  type FloatingPanelRootProps,
} from './components/Root.svelte'
export {
  default as FloatingPanelRootProvider,
  type FloatingPanelRootProviderBaseProps,
  type FloatingPanelRootProviderProps,
} from './components/RootProvider.svelte'
export {
  default as FloatingPanelTitle,
  type FloatingPanelTitleBaseProps,
  type FloatingPanelTitleProps,
} from './components/Title.svelte'
export {
  default as FloatingPanelTrigger,
  type FloatingPanelTriggerBaseProps,
  type FloatingPanelTriggerProps,
} from './components/Trigger.svelte'
export { useFloatingPanelContext, type UseFloatingPanelContext } from './hooks/use-floating-panel-context'
export { useFloatingPanel, type UseFloatingPanelProps, type UseFloatingPanelReturn } from './hooks/use-floating-panel.svelte'
export * as FloatingPanel from './namespace'

export type {
  ElementIds as FloatingPanelElementIds,
  OpenChangeDetails as FloatingPanelOpenChangeDetails,
  PositionChangeDetails as FloatingPanelPositionChangeDetails,
  ResizeTriggerAxis as FloatingPanelResizeTriggerAxis,
  SizeChangeDetails as FloatingPanelSizeChangeDetails,
  StageChangeDetails as FloatingPanelStageChangeDetails,
} from '@destyler/floating-panel'
