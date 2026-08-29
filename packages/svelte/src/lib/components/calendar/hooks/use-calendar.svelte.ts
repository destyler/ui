import type { Accessor } from '$lib/types.js'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import * as calendar from '@destyler/calendar'
import { normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'
import { useEnvironmentContext, useLocaleContext } from '../../../providers/index.js'
import { createMachineProps } from '../../../utils/create-machine-props.js'

export interface UseCalendarProps
  extends Omit<calendar.Context, 'dir' | 'getRootNode' | 'open.controlled' | 'id'> {
  id: string
  defaultOpen?: calendar.Context['open']
  defaultValue?: calendar.Context['value']
  defaultView?: calendar.Context['view']
}

export interface UseCalendarReturn extends Accessor<calendar.Api<PropTypes>> {}

export function useCalendar(props: MaybeFunction<UseCalendarProps>): UseCalendarReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return createMachineProps({
      dir: locale().dir,
      locale: locale().locale,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }, { open: 'defaultOpen', value: 'defaultValue', view: 'defaultView' }, ['open'])
  })

  const [state, send] = useMachine(() => calendar.machine(machineProps.initial as calendar.Context), {
    get context() {
      return machineProps.context as calendar.Context
    },
  })
  const api = $derived(calendar.connect(state, send, normalizeProps))

  return () => api
}
