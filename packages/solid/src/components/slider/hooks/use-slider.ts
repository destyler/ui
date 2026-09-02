import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as slider from '@destyler/slider'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseSliderProps
  extends Optional<Omit<slider.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the slider when it is first rendered.
   * Use when you do not need to control the state of the slider picker.
   */
  defaultValue?: slider.Context['value']
}
export interface UseSliderReturn extends Accessor<slider.Api<PropTypes>> {}

export function useSlider(props: UseSliderProps = {}): UseSliderReturn {
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
  const [state, send] = useMachine(slider.machine(initialContext()), { context })

  return createMemo(() => slider.connect(state, send, normalizeProps))
}
