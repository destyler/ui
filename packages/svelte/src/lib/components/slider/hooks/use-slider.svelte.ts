import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import * as slider from '@destyler/slider'
import { normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'

export interface UseSliderProps extends Omit<slider.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultValue?: slider.Context['value']
}
export interface UseSliderReturn extends Accessor<slider.Api<PropTypes>> {}

export function useSlider(props: MaybeFunction<UseSliderProps>) {
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

  const [state, send] = useMachine(() => slider.machine(machineProps.initial as slider.Context), {
    get context() {
      return machineProps.context as slider.Context
    },
  })
  const api = $derived(slider.connect(state, send, normalizeProps))
  return () => api
}
