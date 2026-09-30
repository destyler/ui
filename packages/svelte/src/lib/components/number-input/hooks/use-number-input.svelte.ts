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
import { onDestroy, tick, untrack } from 'svelte'
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

  let isEditingInput = $state(false)
  let editingInput: HTMLInputElement | undefined
  let composingValue = $state<string>()
  let composingInput: HTMLInputElement | undefined
  let compositionVersion = 0
  let disposed = false
  const isComposing = () => composingValue !== undefined && !!composingInput?.isConnected
  const machine = untrack(() => numberInput.machine(machineProps.initial as numberInput.Context))
  const syncCoreInput = machine.options.actions?.syncInputElement
  const [state, send] = useMachine(machine, {
    get context() {
      return machineProps.context as numberInput.Context
    },
    actions: {
      syncInputElement(context, event, meta) {
        // Bound parent updates also ask core to write its formatted value.
        // Defer that DOM write while the native IME owns this input.
        if (!isComposing())
          syncCoreInput?.(context, event, meta)
      },
    },
  })
  onDestroy(() => {
    disposed = true
    compositionVersion++
  })
  const getInputValue = () => isComposing() ? composingValue : (state.hasTag('focus') && isEditingInput && editingInput?.isConnected ? state.context.value : state.context.formattedValue)
  const syncInputValue = createInputValueSync(
    () => ({ value: getInputValue() }),
    () => state.context.value,
    () => !disposed && !isComposing(),
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
              if ((event as InputEvent).isComposing) {
                if (!isComposing())
                  compositionVersion++
                composingInput = event.currentTarget as HTMLInputElement
                composingValue = composingInput.value
                return
              }
              // A final input event can follow compositionend in the same turn.
              // Its current value supersedes any pending end reconciliation.
              compositionVersion++
              composingValue = undefined
              composingInput = undefined
              editingInput = event.currentTarget as HTMLInputElement
              isEditingInput = true
              void syncInputValue(event)
            },
            oncompositionstart(event: Event) {
              compositionVersion++
              composingInput = event.currentTarget as HTMLInputElement
              composingValue = composingInput.value
            },
            async oncompositionend(event: Event) {
              const input = event.currentTarget as HTMLInputElement
              if (!isComposing()) {
                if (input.value === state.context.value) {
                  editingInput = input
                  isEditingInput = true
                }
                else {
                  void syncInputValue(event)
                }
                return
              }
              const version = compositionVersion
              const value = input.value
              const { selectionStart, selectionEnd, selectionDirection } = input
              composingValue = value
              // Keep native text through both core and bound-parent flushes.
              await tick()
              if (disposed || !input.isConnected || version !== compositionVersion)
                return
              if (value === state.context.value) {
                editingInput = input
                isEditingInput = true
              }
              composingValue = undefined
              composingInput = undefined
              await tick()
              if (disposed || !input.isConnected || version !== compositionVersion)
                return
              if (selectionStart !== null && selectionEnd !== null)
                input.setSelectionRange(selectionStart, selectionEnd, selectionDirection ?? undefined)
            },
            onfocusout() {
              compositionVersion++
              composingValue = undefined
              composingInput = undefined
              editingInput = undefined
              isEditingInput = false
            },
          },
        )
      },
    }
  })

  return () => api
}
