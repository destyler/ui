import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/react'
import * as slider from '@destyler/slider'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseSliderProps extends Optional<Omit<slider.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the slider when it is first rendered.
   * Use when you do not need to control the state of the slider picker.
   */
  defaultValue?: slider.Context['value']
}

export interface UseSliderReturn extends slider.Api<PropTypes> {}

export function useSlider(props: UseSliderProps = {}): UseSliderReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: slider.Context = {
    id: useId(),
    dir,
    getRootNode,
    value: props.defaultValue,
    ...props,
  }

  const context: slider.Context = {
    ...initialContext,
    value: props.value,
    onValueChange: useEvent(props.onValueChange, { sync: true }),
    onValueChangeEnd: useEvent(props.onValueChangeEnd),
    onFocusChange: useEvent(props.onFocusChange),
  }

  const [state, send] = useMachine(slider.machine(initialContext), {
    context,
  })

  return slider.connect(state, send, normalizeProps)
}
