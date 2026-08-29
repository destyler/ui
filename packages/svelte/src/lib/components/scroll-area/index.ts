export { scrollAreaAnatomy } from './anatomy.js'
export {
  default as ScrollAreaContent,
  type ScrollAreaContentBaseProps,
  type ScrollAreaContentProps,
} from './components/Content.svelte'
export {
  default as ScrollAreaCorner,
  type ScrollAreaCornerBaseProps,
  type ScrollAreaCornerProps,
} from './components/Corner.svelte'
export {
  default as ScrollAreaRoot,
  type ScrollAreaRootBaseProps,
  type ScrollAreaRootProps,
} from './components/Root.svelte'
export {
  default as ScrollAreaRootProvider,
  type ScrollAreaRootProviderBaseProps,
  type ScrollAreaRootProviderProps,
} from './components/RootProvider.svelte'
export {
  default as ScrollAreaScrollbar,
  type ScrollAreaScrollbarBaseProps,
  type ScrollAreaScrollbarProps,
} from './components/Scrollbar.svelte'
export {
  default as ScrollAreaThumb,
  type ScrollAreaThumbBaseProps,
  type ScrollAreaThumbProps,
} from './components/Thumb.svelte'
export {
  default as ScrollAreaViewport,
  type ScrollAreaViewportBaseProps,
  type ScrollAreaViewportProps,
} from './components/Viewport.svelte'
export { useScrollAreaContext, type UseScrollAreaContext } from './hooks/use-scroll-area-context.js'
export { useScrollArea, type UseScrollAreaProps, type UseScrollAreaReturn } from './hooks/use-scroll-area.svelte.js'
export * as ScrollArea from './namespace.js'

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
