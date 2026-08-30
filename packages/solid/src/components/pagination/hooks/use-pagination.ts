import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as pagination from '@destyler/pagination'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UsePaginationProps
  extends Optional<Omit<pagination.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial page of the pagination when it is first rendered.
   * Use when you do not need to control the state of the pagination.
   */
  defaultPage?: pagination.Context['page']
}
export interface UsePaginationReturn extends Accessor<pagination.Api<PropTypes>> {}

export function usePagination(props: UsePaginationProps): UsePaginationReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const context = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    page: props.defaultPage,
    ...props,
  }))

  const [state, send] = useMachine(pagination.machine(context()), { context })
  return createMemo(() => pagination.connect(state, send, normalizeProps))
}
