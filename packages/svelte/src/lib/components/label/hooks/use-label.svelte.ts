import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as label from '@destyler/label'
import { runIfFn } from '@destyler/utils'

export interface UseLabelProps
  extends Omit<label.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
}
export interface UseLabelReturn extends Accessor<label.Api<PropTypes>> {}

export function useLabel(props: MaybeFunction<UseLabelProps>): UseLabelReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const context = $derived.by(() => ({
    dir: locale().dir,
    getRootNode: env().getRootNode,
    ...runIfFn(props),
  }) as label.Context)

  const [state, send] = useMachine(() => label.machine(context), {
    get context() {
      return context
    },
  })
  const api = $derived(label.connect(state, send, normalizeProps))
  return () => api
}
