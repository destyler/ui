import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import * as progress from '@destyler/progress'
import { normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'

export interface UseProgressProps extends Omit<progress.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultValue?: progress.Context['value']
}
export interface UseProgressReturn extends Accessor<progress.Api<PropTypes>> {}

export function useProgress(props: MaybeFunction<UseProgressProps>) {
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

  const [state, send] = useMachine(() => progress.machine(machineProps.initial as progress.Context), {
    get context() {
      return machineProps.context as progress.Context
    },
  })
  const api = $derived(progress.connect(state, send, normalizeProps))
  return () => api
}
