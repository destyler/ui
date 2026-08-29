import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import * as checkbox from '@destyler/checkbox'
import { mergeProps, normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'
import { useFieldContext } from '../../field'
import { useCheckboxGroupContext } from './use-checkbox-group-context'

export interface UseCheckboxProps extends Omit<checkbox.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultChecked?: checkbox.Context['checked']
}

export interface UseCheckboxReturn extends Accessor<checkbox.Api<PropTypes>> {}

export function useCheckbox(props: MaybeFunction<UseCheckboxProps>): UseCheckboxReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const checkboxGroup = useCheckboxGroupContext()
  const field = useFieldContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    const localProps = mergeProps(
      resolvedProps,
      checkboxGroup?.()?.getItemProps({ value: resolvedProps.value }) ?? {},
    ) as UseCheckboxProps
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
      ...localProps,
    }, { checked: 'defaultChecked' })
  })

  const [state, send] = useMachine(() => checkbox.machine(machineProps.initial as checkbox.Context), {
    get context() {
      return machineProps.context as checkbox.Context
    },
  })
  const api = $derived(checkbox.connect(state, send, normalizeProps))

  return () => api
}
