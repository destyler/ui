import type { BreadcrumbItem } from '@destyler/breadcrumbs'

export interface RootProps {
  /**
   * The unique identifier of the machine.
   */
  id?: string
  /**
   * The breadcrumb items to display.
   */
  items: BreadcrumbItem[]
}
