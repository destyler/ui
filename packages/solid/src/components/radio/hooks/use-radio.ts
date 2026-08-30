import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as radio from '@destyler/radio'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

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
    value: props.defaultValue,
    ...props,
  }))

  const context = createMemo(() => ({
    ...initialContext(),
    value: props.value,
  }))

  const [state, send] = useMachine(radio.machine(initialContext()), {
    context,
  })

  return createMemo(() => radio.connect(state, send, normalizeProps))
}
