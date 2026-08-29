import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as carousel from '@destyler/carousel'
import { runIfFn } from '@destyler/utils'

export interface UseCarouselProps extends Omit<carousel.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultPage?: carousel.Context['page']
}
export interface UseCarouselReturn extends Accessor<carousel.Api<PropTypes>> {}

export function useCarousel(props: MaybeFunction<UseCarouselProps>) {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }, { page: 'defaultPage' })
  })

  const [state, send] = useMachine(() => carousel.machine(machineProps.initial as carousel.Context), {
    get context() {
      return machineProps.context as carousel.Context
    },
  })
  const api = $derived(carousel.connect(state, send, normalizeProps))

  return () => api
}
