import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as collapse from '@destyler/collapse'
import { runIfFn } from '@destyler/utils'

export interface UseCollapseProps extends Omit<collapse.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultValue?: collapse.Context['value']
}
export interface UseCollapseReturn extends Accessor<collapse.Api<PropTypes>> {}

export function useCollapse(props: MaybeFunction<UseCollapseProps>): UseCollapseReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }, { value: 'defaultValue' })
  })

  const [state, send] = useMachine(() => collapse.machine(machineProps.initial as collapse.Context), {
    get context() {
      return machineProps.context as collapse.Context
    },
  })
  const api = $derived(collapse.connect(state, send, normalizeProps))

  return () => api
}
