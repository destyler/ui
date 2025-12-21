import type * as separator from '@destyler/separator'

export interface RootProps {
  /**
   * The unique identifier of the machine.
   */
  id?: string
  /**
   * The orientation of the separator.
   * @default "horizontal"
   */
  orientation?: separator.Orientation
}

export interface RootEmits {
}
