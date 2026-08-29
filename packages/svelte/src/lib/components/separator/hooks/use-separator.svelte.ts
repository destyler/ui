import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import * as separator from '@destyler/separator'
import { normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'

export interface UseSeparatorProps
  extends Omit<separator.Context, 'getRootNode' | 'id'> {
  id: string
}
export interface UseSeparatorReturn extends Accessor<separator.Api<PropTypes>> {}

export function useSeparator(props: MaybeFunction<UseSeparatorProps>): UseSeparatorReturn {
  const env = useEnvironmentContext()
  const context = $derived.by(() => ({
    getRootNode: env().getRootNode,
    ...runIfFn(props),
  }) as separator.Context)
  const [state, send] = useMachine(() => separator.machine(context), {
    get context() {
      return context
    },
  })
  const api = $derived(separator.connect(state, send, normalizeProps))
  return () => api
}
