import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import * as splitter from '@destyler/splitter'
import { normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'

export interface UseSplitterProps extends Omit<splitter.Context, 'dir' | 'getRootNode' | 'id'> {
  /**
   * A stable id for the splitter.
   *
   * Svelte hooks cannot call `$props.id()`. Components should pass the id
   * generated at the component's top level; `Splitter.Root` does this
   * automatically.
   */
  id: string
  defaultSize?: splitter.Context['size']
}

export interface UseSplitterReturn extends Accessor<splitter.Api<PropTypes>> {}

export function useSplitter(props: MaybeFunction<UseSplitterProps>): UseSplitterReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }, { size: 'defaultSize' })
  })

  const [state, send] = useMachine(() => splitter.machine(machineProps.initial as splitter.Context), {
    get context() {
      return machineProps.context as splitter.Context
    },
  })

  const api = $derived(splitter.connect(state, send, normalizeProps))

  return () => api
}
