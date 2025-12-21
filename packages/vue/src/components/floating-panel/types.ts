import type * as floatingPanel from '@destyler/floating-panel'

export interface RootProps {
  /**
   * Whether the floating panel is open
   */
  'open'?: boolean
  /**
   * The initial open state of the floating panel when it is first rendered.
   * Use when you do not need to control its open state.
   */
  'defaultOpen'?: boolean
  /**
   * The unique identifier of the machine.
   */
  'id'?: string
  /**
   * The ids of the elements in the floating panel. Useful for composition.
   */
  'ids'?: floatingPanel.ElementIds
  /**
   * Whether the panel is disabled
   */
  'disabled'?: boolean
  /**
   * Whether the panel is draggable
   * @default true
   */
  'draggable'?: boolean
  /**
   * Whether the panel is resizable
   * @default true
   */
  'resizable'?: boolean
  /**
   * Whether the panel should be strictly contained within the boundary when dragging
   * @default true
   */
  'allowOverflow'?: boolean
  /**
   * The strategy to use for positioning
   * @default "absolute"
   */
  'strategy'?: 'absolute' | 'fixed'
  /**
   * The position of the panel
   */
  'position'?: { x: number, y: number }
  /**
   * The minimum size of the panel
   */
  'minSize'?: { width: number, height: number }
  /**
   * The maximum size of the panel
   */
  'maxSize'?: { width: number, height: number }
  /**
   * The size of the panel
   */
  'size'?: { width: number, height: number }
  /**
   * The snap grid for the panel
   * @default 1
   */
  'gridSize'?: number
  /**
   * Whether the panel is locked to its aspect ratio
   */
  'lockAspectRatio'?: boolean
  /**
   * Whether the panel should close when the escape key is pressed
   */
  'closeOnEscape'?: boolean
  /**
   * Whether the panel size and position should be preserved when it is closed
   */
  'persistRect'?: boolean
}

export interface RootEmits {
  /**
   * Callback to be invoked when the floating panel is opened or closed
   */
  'openChange': [details: floatingPanel.OpenChangeDetails]
  /**
   * Callback to be invoked when the size changes
   */
  'sizeChange': [details: floatingPanel.SizeChangeDetails]
  /**
   * Callback to be invoked when the size change ends
   */
  'sizeChangeEnd': [details: floatingPanel.SizeChangeDetails]
  /**
   * Callback to be invoked when the position changes
   */
  'positionChange': [details: floatingPanel.PositionChangeDetails]
  /**
   * Callback to be invoked when the position change ends
   */
  'positionChangeEnd': [details: floatingPanel.PositionChangeDetails]
  /**
   * Callback to be invoked when the stage changes
   */
  'stageChange': [details: floatingPanel.StageChangeDetails]
  /**
   * v-model event for open state
   */
  'update:open': [open: boolean]
}
