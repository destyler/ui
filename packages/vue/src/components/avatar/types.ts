import type * as image from '@destyler/image'

export interface RootProps {
  /**
   * The unique identifier of the machine.
   */
  id?: string
  /**
   * The ids of the elements in the avatar. Useful for composition.
   */
  ids?: Partial<{ root: string, image: string, fallback: string }>
}

export interface RootEmits {
  /**
   * Functional called when the image loading status changes.
   */
  statusChange: [details: image.StatusChangeDetails]
}
