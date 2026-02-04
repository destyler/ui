import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as pagination from '@destyler/pagination'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UsePaginationProps extends Optional<Omit<pagination.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial page of the pagination when it is first rendered.
   * Use when you do not need to control the state of the pagination.
   */
  defaultPage?: pagination.Context['page']
}

export interface UsePaginationReturn extends pagination.Api<PropTypes> {}

export function usePagination(props: UsePaginationProps): UsePaginationReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: pagination.Context = {
    id: useId(),
    dir,
    getRootNode,
    page: props.defaultPage,
    ...props,
  }

  const context: pagination.Context = {
    ...initialContext,
    page: props.page,
    onPageChange: useEvent(props.onPageChange, { sync: true }),
  }

  const [state, send] = useMachine(pagination.machine(initialContext), { context })
  return pagination.connect(state, send, normalizeProps)
}
