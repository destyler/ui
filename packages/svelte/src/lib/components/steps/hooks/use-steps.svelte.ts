import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import * as steps from '@destyler/steps'
import { normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'

export interface UseStepsProps extends Omit<steps.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultStep?: steps.Context['step']
}
export interface UseStepsReturn extends Accessor<steps.Api<PropTypes>> {}

export function useSteps(props: MaybeFunction<UseStepsProps>) {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }, { step: 'defaultStep' })
  })

  const [state, send] = useMachine(() => steps.machine(machineProps.initial as steps.Context), {
    get context() {
      return machineProps.context as steps.Context
    },
  })
  const api = $derived(steps.connect(state, send, normalizeProps))

  return () => api
}
