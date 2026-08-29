import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import * as numberInput from '@destyler/number-input'
import { normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'
import { useFieldContext } from '../../field'

export interface UseNumberInputProps extends Omit<numberInput.Context, 'dir' | 'getRootNode' | 'id'> {
  /**
   * A stable id for the number input.
   *
   * Svelte hooks cannot call `$props.id()`. Components should pass the id
   * generated at the component's top level; `NumberInput.Root` does this
   * automatically.
   */
  id: string
  defaultValue?: numberInput.Context['value']
}

export interface UseNumberInputReturn extends Accessor<numberInput.Api<PropTypes>> {}

export function useNumberInput(props: MaybeFunction<UseNumberInputProps>): UseNumberInputReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return createMachineProps({
      ids: {
        label: field?.()?.ids.label,
        input: field?.()?.ids.control,
      },
      dir: locale().dir,
      locale: locale().locale,
      disabled: field?.()?.disabled,
      readOnly: field?.()?.readOnly,
      invalid: field?.()?.invalid,
      required: field?.()?.required,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }, { value: 'defaultValue' })
  })

  const [state, send] = useMachine(() => numberInput.machine(machineProps.initial as numberInput.Context), {
    get context() {
      return machineProps.context as numberInput.Context
    },
  })
  const api = $derived(numberInput.connect(state, send, normalizeProps))

  return () => api
}
