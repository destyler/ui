import type { HTMLUIProps } from '~/factory'

export interface RootProps extends HTMLUIProps<'div'> {
  /**
   * The unique identifier of the machine.
   */
  id?: string
}
