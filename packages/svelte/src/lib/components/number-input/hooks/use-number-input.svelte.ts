import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import { createInputValueSync } from '$lib/utils/sync-input-value'
import { syncNumberInputElement } from '$lib/utils/sync-number-input'
import { createScope } from '@destyler/dom'
import * as numberInput from '@destyler/number-input'
import { mergeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'
import { onDestroy, onMount, tick, untrack } from 'svelte'
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
  let compositionEpoch = 0
  let disposed = false
  let cancelInputSync: (() => void) | undefined
  const isComposing = () => composingValue !== undefined && !!composingInput?.isConnected
  const machine = untrack(() => numberInput.machine(machineProps.initial as numberInput.Context))
  const scope = createScope({})
  const trackCoreFormControl = machine.options.activities?.trackFormControl
  let refreshFormControl: (() => void) | undefined
  machine.setOptions({
    activities: {
      trackFormControl(context, event, meta) {
        let trackedInput: HTMLInputElement | null | undefined
        let trackedForm: HTMLFormElement | null | undefined
        let cleanup: (() => void) | undefined
        const refresh = () => {
          const inputId = context.ids?.input ?? `number-input:${context.id}:input`
          const input = scope.getById<HTMLInputElement>(context, inputId)
          const form = input?.form
          if (input === trackedInput && form === trackedForm)
            return
          cleanup?.()
          trackedInput = input
          trackedForm = form
          cleanup = trackCoreFormControl?.(context, event, meta) ?? undefined
        }
        refreshFormControl = refresh
        refresh()
        return () => {
          refreshFormControl = undefined
          cleanup?.()
        }
      },
    },
  })
  const [state, send] = useMachine(machine, {
    get context() {
      return machineProps.context as numberInput.Context
    },
    actions: {
      syncInputElement(context, event) {
        cancelInputSync?.()
        if (isComposing())
          return
        const inputId = context.ids?.input ?? `number-input:${context.id}:input`
        const input = scope.getById<HTMLInputElement>(context, inputId)
        if (!input)
          return
        const epoch = compositionEpoch
        const value = event.type.endsWith('CHANGE') ? context.value : context.formattedValue
        // Core queues its write in RAF. Composition can start after this action
        // ran, so check ownership again at execution time, including end/blur.
        cancelInputSync = syncNumberInputElement(input, value ?? '', () => !disposed && !isComposing()
          && epoch === compositionEpoch && scope.getById(context, inputId) === input)
      },
    },
  })
  onDestroy(() => {
    disposed = true
    cancelInputSync?.()
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
                if (!isComposing()) {
                  compositionVersion++
                  compositionEpoch++
                }
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
              compositionEpoch++
              compositionVersion++
              composingInput = event.currentTarget as HTMLInputElement
              composingValue = composingInput.value
            },
            async oncompositionend(event: Event) {
              compositionEpoch++
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
              compositionEpoch++
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

  onMount(() => {
    const root = env().getRootNode()
    const getInput = () => scope.getById<HTMLInputElement>(state.context, String(api.getInputProps().id))
    const onReset = async (event: Event) => {
      // Refresh even for a different form: a moved or removed input must stop
      // listening to its old form before that form's reset reaches target phase.
      // Core keeps the original seed and controlled ownership callback rules.
      refreshFormControl?.()
      const input = getInput()
      if (!input || input.form !== event.target)
        return
      // The browser resets the property even when core's initial value equals
      // its current value (and thus triggers no watcher). Reconcile after the
      // default action and parent writeback, also ending any interrupted edit.
      await tick()
      if (event.defaultPrevented || disposed || !input.isConnected || input !== getInput())
        return
      const version = ++compositionVersion
      compositionEpoch++
      composingValue = undefined
      composingInput = undefined
      editingInput = undefined
      isEditingInput = false
      await tick()
      if (disposed || !input.isConnected || version !== compositionVersion || input !== getInput())
        return
      input.value = String(getInputValue() ?? '')
    }
    root.addEventListener('reset', onReset, true)
    return () => root.removeEventListener('reset', onReset, true)
  })

  return () => api
}
