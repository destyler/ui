import type * as scrollArea from '@destyler/scroll-area'
import type { UnwrapRef } from 'vue'
import type { UseScrollAreaReturn } from './composables/use-scroll-area'

export interface RootProps {
  /**
   * The unique identifier of the machine.
   */
  id?: string
  /**
   * The ids of the elements in the scroll area. Useful for composition.
   */
  ids?: Partial<{
    root: string
    viewport: string
    content: string
    scrollbarX: string
    scrollbarY: string
    thumbX: string
    thumbY: string
    corner: string
  }>
  /**
   * The time in milliseconds before the scrollbar hides after the user stops interacting.
   * @default 600
   */
  scrollHideDelay?: number
  /**
   * The scroll behavior type.
   * - "auto" - scrollbars are visible when content overflows
   * - "always" - scrollbars are always visible
   * - "scroll" - scrollbars are visible when scrolling
   * - "hover" - scrollbars are visible when hovering
   * @default "hover"
   */
  type?: scrollArea.ScrollbarVisibility
  /**
   * The text direction of the scroll area.
   */
  dir?: 'ltr' | 'rtl'
  /**
   * Virtual scroll options for efficient rendering of large lists.
   */
  virtual?: scrollArea.VirtualScrollOptions
  /**
   * Function that returns the root node. Useful for shadow DOM.
   */
  getRootNode?: () => Node
}

export interface RootEmits {
  /**
   * Function called when the scroll position changes.
   */
  scroll: [details: scrollArea.ScrollChangeDetails]
}

export interface RootProviderProps {
  value: UnwrapRef<UseScrollAreaReturn>
}

export interface ScrollbarProps {
  /**
   * The orientation of the scrollbar.
   * @default "vertical"
   */
  orientation?: scrollArea.Orientation
}

export interface ThumbProps {
  /**
   * The orientation of the thumb.
   * @default "vertical"
   */
  orientation?: scrollArea.Orientation
}
