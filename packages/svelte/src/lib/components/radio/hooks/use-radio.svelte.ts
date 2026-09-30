import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import type { Accessor } from '../../../types'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { normalizeProps } from '$lib/utils/normalize-props'
import { createRadioCheckedSync } from '$lib/utils/sync-checked'
import * as radio from '@destyler/radio'
import { mergeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'
import { useEnvironmentContext, useLocaleContext } from '../../../providers'
import { createMachineProps } from '../../../utils/create-machine-props'

export interface UseRadioProps extends Omit<radio.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultValue?: radio.Context['value']
}
export interface UseRadioReturn extends Accessor<radio.Api<PropTypes>> {}

export function useRadio(props: MaybeFunction<UseRadioProps>): UseRadioReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const resolvedProps = $derived.by(() => {
    const localProps = runIfFn(props)
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...localProps,
    }, { value: 'defaultValue' })
  })

  const [state, send] = useMachine(() => radio.machine(resolvedProps.initial as radio.Context), {
    get context() {
      return resolvedProps.context as radio.Context
    },
  })
  const connected = $derived(radio.connect(state, send, normalizeProps))
  const syncChecked = createRadioCheckedSync(value => connected.getItemState({ value }).checked)
  const api = $derived({
    ...connected,
    getItemHiddenInputProps(itemProps: radio.ItemProps) {
      return mergeProps(connected.getItemHiddenInputProps(itemProps), { onclick: syncChecked })
    },
  })
  return () => api
}
