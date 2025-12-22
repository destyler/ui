import type * as navigationMenu from '@destyler/navigation-menu'

export interface RootProps {
  /**
   * The controlled value of the menu item to activate.
   * Can be used as v-model.
   */
  'value'?: string | null
  /**
   * The value of the menu item to activate by default.
   * Use when you do not need to control the state.
   */
  'defaultValue'?: string
  /**
   * The orientation of the menu.
   * @default 'horizontal'
   */
  'orientation'?: 'horizontal' | 'vertical'
  /**
   * The open delay of the menu content.
   * @default 200
   */
  'openDelay'?: number
  /**
   * The close delay of the menu content.
   * @default 300
   */
  'closeDelay'?: number
  /**
   * Whether to disable click trigger.
   * @default false
   */
  'disableClickTrigger'?: boolean
  /**
   * Whether to disable hover trigger.
   * @default false
   */
  'disableHoverTrigger'?: boolean
  /**
   * Whether to disable pointer leave close.
   * @default false
   */
  'disablePointerLeaveClose'?: boolean
  /**
   * The unique identifier of the machine.
   */
  'id'?: string
  /**
   * The ids of the elements in the navigation menu. Useful for composition.
   */
  'ids'?: Partial<{
    root: string
    list: string
    viewport: string
    viewportPositioner: string
    indicator: string
    trigger: (value: string) => string
    link: (value: string) => string
    content: (value: string) => string
    item: (value: string) => string
  }>
}

export interface RootEmits {
  /**
   * Callback when the value changes.
   */
  'valueChange': [details: navigationMenu.ValueChangeDetails]
  /**
   * The callback fired when the model value changes.
   */
  'update:value': [value: string | null]
}
