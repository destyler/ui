import type { Accessor } from '$lib/types.js'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as scrollArea from '@destyler/scroll-area'
import { runIfFn } from '@destyler/utils'
import { onMount } from 'svelte'
import { useEnvironmentContext, useLocaleContext } from '../../../providers/index.js'

export interface UseScrollAreaProps extends Omit<scrollArea.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultScrollTop?: number
  defaultScrollLeft?: number
}

export interface UseScrollAreaReturn extends Accessor<scrollArea.Api<PropTypes>> {}

export function useScrollArea(props: MaybeFunction<UseScrollAreaProps>): UseScrollAreaReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    const contextProps = { ...resolvedProps }
    delete contextProps.defaultScrollTop
    delete contextProps.defaultScrollLeft
    return {
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...contextProps,
    }
  })

  const [state, send] = useMachine(() => scrollArea.machine(machineProps as scrollArea.Context), {
    get context() {
      return machineProps as scrollArea.Context
    },
  })

  const api = $derived(scrollArea.connect(state, send, normalizeProps))

  onMount(() => {
    const resolvedProps = runIfFn(props)
    const top = resolvedProps.defaultScrollTop
    const left = resolvedProps.defaultScrollLeft
    if (top !== undefined || left !== undefined)
      api.scrollTo({ top, left })
  })

  return () => api
}
