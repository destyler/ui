import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { createMachineProps } from '$lib/utils/create-machine-props'
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'

export interface UseAspectRatioProps
  extends Omit<aspectRatio.Context, 'getRootNode' | 'id'> {
  id: string
  defaultRatio?: aspectRatio.Context['ratio']
}

export interface UseAspectRatioReturn extends Accessor<aspectRatio.Api<PropTypes>> {}

export function useAspectRatio(
  props: MaybeFunction<UseAspectRatioProps>,
): UseAspectRatioReturn {
  const env = useEnvironmentContext()

  const machineProps = $derived.by(() => {
    const resolved = runIfFn(props)
    return createMachineProps({
      getRootNode: env().getRootNode,
      ...resolved,
    }, { ratio: 'defaultRatio' })
  })

  const [state, send] = useMachine(() => aspectRatio.machine(machineProps.initial as aspectRatio.Context), {
    get context() {
      return machineProps.context as aspectRatio.Context
    },
  })
  const api = $derived(aspectRatio.connect(state, send, normalizeProps))

  return () => api
}
