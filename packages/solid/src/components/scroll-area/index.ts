export { scrollAreaAnatomy } from './anatomy'
export {
  ScrollAreaContent,
  type ScrollAreaContentBaseProps,
  type ScrollAreaContentProps,
} from './components/Content'
export {
  ScrollAreaCorner,
  type ScrollAreaCornerBaseProps,
  type ScrollAreaCornerProps,
} from './components/Corner'
export {
  ScrollAreaRoot,
  type ScrollAreaRootBaseProps,
  type ScrollAreaRootProps,
} from './components/Root'
export {
  ScrollAreaRootProvider,
  type ScrollAreaRootProviderBaseProps,
  type ScrollAreaRootProviderProps,
} from './components/RootProvider'
export {
  ScrollAreaScrollbar,
  type ScrollAreaScrollbarBaseProps,
  type ScrollAreaScrollbarProps,
} from './components/Scrollbar'
export {
  ScrollAreaThumb,
  type ScrollAreaThumbBaseProps,
  type ScrollAreaThumbProps,
} from './components/Thumb'
export {
  ScrollAreaViewport,
  type ScrollAreaViewportBaseProps,
  type ScrollAreaViewportProps,
} from './components/Viewport'
export { useScrollArea, type UseScrollAreaProps, type UseScrollAreaReturn } from './hooks/use-scroll-area'
export { useScrollAreaContext, type UseScrollAreaContext } from './hooks/use-scroll-area-context'
export * as ScrollArea from './namespace'

export type {
  Orientation as ScrollAreaOrientation,
  ScrollbarVisibility as ScrollAreaScrollbarVisibility,
  ScrollChangeDetails as ScrollAreaScrollChangeDetails,
  ScrollDetails as ScrollAreaScrollDetails,
  ScrollType as ScrollAreaScrollType,
  VirtualItem as ScrollAreaVirtualItem,
  VirtualRange as ScrollAreaVirtualRange,
  VirtualScrollOptions as ScrollAreaVirtualScrollOptions,
  VirtualScrollState as ScrollAreaVirtualScrollState,
} from '@destyler/scroll-area'
