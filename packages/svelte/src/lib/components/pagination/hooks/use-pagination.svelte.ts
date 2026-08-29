import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import type { Accessor } from '../../../types'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as pagination from '@destyler/pagination'
import { runIfFn } from '@destyler/utils'
import { useEnvironmentContext, useLocaleContext } from '../../../providers'
import { createMachineProps } from '../../../utils/create-machine-props'

export interface UsePaginationProps extends Omit<pagination.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultPage?: pagination.Context['page']
}
export interface UsePaginationReturn extends Accessor<pagination.Api<PropTypes>> {}

export function usePagination(props: MaybeFunction<UsePaginationProps>): UsePaginationReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const resolvedProps = $derived.by(() => {
    const localProps = runIfFn(props)
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...localProps,
    }, { page: 'defaultPage' })
  })

  const [state, send] = useMachine(() => pagination.machine(resolvedProps.initial as pagination.Context), {
    get context() {
      return resolvedProps.context as pagination.Context
    },
  })
  const api = $derived(pagination.connect(state, send, normalizeProps))

  return () => api
}
