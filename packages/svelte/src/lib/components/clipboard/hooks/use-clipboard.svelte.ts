import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as clipboard from '@destyler/clipboard'
import { runIfFn } from '@destyler/utils'

export interface UseClipboardProps extends Omit<clipboard.Context, 'getRootNode' | 'id'> {
  id: string
}

export interface UseClipboardReturn extends Accessor<clipboard.Api<PropTypes>> {}

export function useClipboard(props: MaybeFunction<UseClipboardProps>): UseClipboardReturn {
  const env = useEnvironmentContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props) || {}
    return {
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }
  })

  const [state, send] = useMachine(() => clipboard.machine(machineProps as clipboard.Context), {
    get context() {
      return machineProps as clipboard.Context
    },
  })
  const api = $derived(clipboard.connect(state, send, normalizeProps))

  return () => api
}
