import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '@destyler/svelte'
import * as tabs from '@destyler/tabs'
import { runIfFn } from '@destyler/utils'

export interface UseTabsProps extends Omit<tabs.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultValue?: tabs.Context['value']
}
export interface UseTabsReturn extends Accessor<tabs.Api<PropTypes>> {}

export function useTabs(props: MaybeFunction<UseTabsProps>): UseTabsReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const localProps = runIfFn(props)
    return createMachineProps({
      ...localProps,
      dir: locale().dir,
      getRootNode: env().getRootNode,
    }, { value: 'defaultValue' })
  })

  const [state, send] = useMachine(() => tabs.machine(machineProps.initial as tabs.Context), {
    get context() {
      return machineProps.context as tabs.Context
    },
  })
  const api = $derived(tabs.connect(state, send, normalizeProps))

  return () => api
}
