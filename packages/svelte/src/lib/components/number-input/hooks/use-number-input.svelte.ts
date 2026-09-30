import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import { createInputValueSync } from '$lib/utils/sync-input-value'
import * as numberInput from '@destyler/number-input'
import { mergeProps } from '@destyler/svelte'
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
  let isEditingInput = $state(false)
  const getInputValue = () => state.hasTag('focus') && isEditingInput ? state.context.value : state.context.formattedValue
  const syncInputValue = createInputValueSync(
    () => ({ value: getInputValue() }),
    () => state.context.value,
  )
  const api = $derived.by(() => {
    const connected = numberInput.connect(state, send, normalizeProps)
    return {
      ...connected,
      getInputProps() {
        const inputProps = connected.getInputProps()
        // Core exposes a formatted defaultValue, but Svelte applies it as a
        // live value. Keep the core's raw text during native editing so partial
        // numbers such as "1." are not reformatted during accepted input.
        return mergeProps(
          inputProps,
          {
            value: getInputValue(),
            oninput(event: Event) {
              if ((event as InputEvent).isComposing)
                return
              isEditingInput = true
              void syncInputValue(event)
            },
            oncompositionend(event: Event) {
              const input = event.currentTarget as HTMLInputElement
              if (input.value === state.context.value) {
                isEditingInput = true
                return
              }
              void syncInputValue(event)
            },
            onfocusout() {
              isEditingInput = false
            },
          },
        )
      },
    }
  })

  return () => api
}
