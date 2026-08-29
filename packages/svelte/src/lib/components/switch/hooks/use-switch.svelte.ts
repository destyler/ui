import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as zagSwitch from '@destyler/switch'
import { runIfFn } from '@destyler/utils'
import { useFieldContext } from '../../field'

export interface UseSwitchProps extends Omit<zagSwitch.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultChecked?: zagSwitch.Context['checked']
}
export interface UseSwitchReturn extends Accessor<zagSwitch.Api<PropTypes>> {}

export function useSwitch(props: MaybeFunction<UseSwitchProps>) {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ids: {
        label: field?.().ids.label,
        hiddenInput: field?.().ids.control,
      },
      disabled: field?.().disabled,
      readOnly: field?.().readOnly,
      invalid: field?.().invalid,
      required: field?.().required,
      ...resolvedProps,
    }, { checked: 'defaultChecked' })
  })

  const [state, send] = useMachine(() => zagSwitch.machine(machineProps.initial as zagSwitch.Context), {
    get context() {
      return machineProps.context as zagSwitch.Context
    },
  })
  const api = $derived(zagSwitch.connect(state, send, normalizeProps))

  return () => api
}
