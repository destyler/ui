import type * as collapse from '@destyler/collapse'

export interface RootProps {
  /**
   * Whether an collapse item can be closed after it has been expanded.
   * @default false
   */
  collapsible?: boolean
  /**
   * The initial value of the collapse that are expanded.
   * Use this when you do not need to control the state of the collapse.
   */
  defaultValue?: string[]
  /**
   * Whether the collapse items are disabled
   */
  disabled?: boolean
  /**
   * The unique identifier of the machine.
   */
  id?: string
  /**
   * The ids of the elements in the collapse. Useful for composition.
   */
  ids?: Partial<{
    root: string
    item: (value: string) => string
    itemContent: (value: string) => string
    itemTrigger: (value: string) => string
  }>
  /**
   * The collapse items that are currently expanded.
   * Use this prop to control the state of the items via v-model.
   */
  modelValue?: string[]
  /**
   * Whether multiple collapse items can be expanded at the same time.
   * @default false
   */
  multiple?: boolean
  /**
   *  The orientation of the collapse items.
   *  @default "vertical"
   */
  orientation?: 'horizontal' | 'vertical'
}

export interface RootEmits {
  /**
   * The callback fired when the focused collapse item changes.
   */
  "focusChange": [details: collapse.FocusChangeDetails]
  /**
   * The callback fired when the state of expanded/collapsed collapse items changes.
   */
  "valueChange": [details: collapse.ValueChangeDetails]
  /**
   * The callback fired when the model value changes.
   */
  'update:modelValue': [value: string[]]
}
