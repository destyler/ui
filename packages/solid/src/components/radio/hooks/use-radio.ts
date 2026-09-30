import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as radio from '@destyler/radio'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { resolveMachineProps } from '~/utils/resolve-machine-props'
import { restoreControlledInput, restoreRadioGroup } from '~/utils/restore-controlled-input'

export interface UseRadioProps
  extends Optional<Omit<radio.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the radio group when it is first rendered.
   * Use when you do not need to control the state of the radio group.
   */
  defaultValue?: radio.Context['value']
}
export interface UseRadioReturn extends Accessor<radio.Api<PropTypes>> {}

export function useRadio(props: UseRadioProps = {}): UseRadioReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const initialContext = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...resolveMachineProps(props),
  }))

  const context = createMemo(() => ({
    ...initialContext(),
    ...(props.value !== undefined ? { value: props.value } : {}),
  }))

  const [state, send] = useMachine(radio.machine(initialContext()), {
    context,
  })

  const controlled = props.value !== undefined
  return createMemo(() => {
    const api = radio.connect(state, send, normalizeProps)
    if (!controlled)
      return api
    return {
      ...api,
      getItemHiddenInputProps(itemProps) {
        return restoreControlledInput(api.getItemHiddenInputProps(itemProps), (input) => {
          restoreRadioGroup(input, props.value === undefined ? state.context.value : props.value)
        })
      },
    }
  })
}
