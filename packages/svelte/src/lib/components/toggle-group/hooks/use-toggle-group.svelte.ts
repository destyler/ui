import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '@destyler/svelte'
import * as toggleGroup from '@destyler/toggle'
import { runIfFn } from '@destyler/utils'

export interface UseToggleGroupProps extends Omit<toggleGroup.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultValue?: toggleGroup.Context['value']
}

export interface UseToggleGroupReturn extends Accessor<toggleGroup.Api<PropTypes>> {}

export function useToggleGroup(props: MaybeFunction<UseToggleGroupProps>): UseToggleGroupReturn {
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

  const [state, send] = useMachine(() => toggleGroup.machine(machineProps.initial as toggleGroup.Context), {
    get context() {
      return machineProps.context as toggleGroup.Context
    },
  })

  const api = $derived(toggleGroup.connect(state, send, normalizeProps))

  return () => api
}
