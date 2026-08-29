import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import * as colorPicker from '@destyler/color-picker'
import { normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'
import { useFieldContext } from '../../field'

export interface UseColorPickerProps
  extends Omit<colorPicker.Context, 'dir' | 'getRootNode' | 'open.controlled' | 'id'> {
  id: string
  defaultOpen?: colorPicker.Context['open']
  defaultValue?: colorPicker.Context['value']
}

export interface UseColorPickerReturn extends Accessor<colorPicker.Api<PropTypes>> {}

export function useColorPicker(props: MaybeFunction<UseColorPickerProps>): UseColorPickerReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return createMachineProps({
      ids: {
        label: field?.()?.ids.label,
        hiddenInput: field?.()?.ids.control,
      },
      dir: locale().dir,
      disabled: field?.()?.disabled,
      readOnly: field?.()?.readOnly,
      invalid: field?.()?.invalid,
      required: field?.()?.required,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }, { open: 'defaultOpen', value: 'defaultValue' }, ['open'])
  })

  const [state, send] = useMachine(() => colorPicker.machine(machineProps.initial as colorPicker.Context), {
    get context() {
      return machineProps.context as colorPicker.Context
    },
  })
  const api = $derived(colorPicker.connect(state, send, normalizeProps))

  return () => api
}
