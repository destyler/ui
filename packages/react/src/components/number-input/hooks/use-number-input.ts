import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as numberInput from '@destyler/number-input'
import { normalizeProps } from '@destyler/react'
import { useId, useRef } from 'react'
import { useFieldContext } from '~/components/field'
import { useEvent } from '~/hooks/use-event'
import { useMachine } from '~/hooks/use-machine'
import { useDeferredInputValue, useNativeInputValueSync } from '~/hooks/use-native-input-sync'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { normalizeMachineProps } from '~/utils/normalize-machine-props'

export interface UseNumberInputProps extends Optional<Omit<numberInput.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the number input when it is first rendered.
   * Use when you do not need to control the state of the number input.
   */
  defaultValue?: numberInput.Context['value']
}
export interface UseNumberInputReturn extends numberInput.Api<PropTypes> {}

export function useNumberInput(props: UseNumberInputProps = {}): UseNumberInputReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir, locale } = useLocaleContext()
  const field = useFieldContext()

  const initialContext: numberInput.Context = {
    id: useId(),
    ids: {
      label: field?.ids.label,
      input: field?.ids.control,
    },
    disabled: field?.disabled,
    readOnly: field?.readOnly,
    required: field?.required,
    invalid: field?.invalid,
    dir,
    locale,
    getRootNode,
    ...normalizeMachineProps(props),
  }

  const context: numberInput.Context = {
    ...initialContext,
    ...(props.value !== undefined ? { value: props.value } : {}),
    onValueChange: useEvent(props.onValueChange, { sync: true }),
    onValueInvalid: useEvent(props.onValueInvalid),
    onFocusChange: useEvent(props.onFocusChange),
  }

  const composing = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const machine = numberInput.machine(initialContext)
  const syncInputValue = useDeferredInputValue(composing)
  const [state, send, service] = useMachine(machine, {
    context,
    actions: {
      syncInputElement(context, event, meta) {
        if (composing.current?.isConnected)
          return
        const id = numberInput.connect(meta.state, meta.send, normalizeProps).getInputProps().id!
        const root = (context.getRootNode?.() ?? document) as Document | ShadowRoot
        const input = root.getElementById(id) as HTMLInputElement | null
        if (input) {
          const value = event.type.endsWith('CHANGE') ? context.value : context.formattedValue
          syncInputValue(input, value ?? '')
        }
      },
    },
  })
  const syncInputProps = useNativeInputValueSync(
    () => service.state.hasTag('focus') ? service.state.context.value : service.state.context.formattedValue,
    composing,
    () => service.state.context.formattedValue,
  )
  const api = numberInput.connect(state, send, normalizeProps)
  return {
    ...api,
    getInputProps() {
      return syncInputProps(api.getInputProps(), 'onInput')
    },
  }
}
