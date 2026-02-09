import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as colorPicker from '@destyler/color-picker'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId, useMemo } from 'react'
import { useFieldContext } from '~/components/field'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseColorPickerProps
  extends Optional<Omit<colorPicker.Context, 'open.controlled' | 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial open state of the color picker when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: colorPicker.Context['open']
  /**
   * The initial value of the color picker when it is first rendered.
   * Use when you do not need to control the state of the color picker.
   */
  defaultValue?: colorPicker.Context['value']
}

export interface UseColorPickerReturn extends colorPicker.Api<PropTypes> {}

export function useColorPicker(props: UseColorPickerProps = {}): UseColorPickerReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()
  const field = useFieldContext()

  const { defaultValue, defaultOpen, value, open, onValueChange, onValueChangeEnd, onOpenChange, onFormatChange, onFocusOutside, onInteractOutside, onPointerDownOutside, ...restProps } = props

  const initialContext: colorPicker.Context = {
    'id': useId(),
    'ids': {
      label: field?.ids.label,
      input: field?.ids.control,
    },
    dir,
    'disabled': field?.disabled,
    'invalid': field?.invalid,
    'readOnly': field?.readOnly,
    'required': field?.required,
    getRootNode,
    'open': defaultOpen ?? open,
    'open.controlled': open !== undefined,
    'value': defaultValue ?? value,
    ...restProps,
  }

  const context: colorPicker.Context = {
    ...initialContext,
    open,
    value,
    onOpenChange: useEvent(onOpenChange),
    onValueChange: useEvent(onValueChange, { sync: true }),
    onValueChangeEnd: useEvent(onValueChangeEnd),
    onFormatChange: useEvent(onFormatChange),
    onFocusOutside: useEvent(onFocusOutside),
    onInteractOutside: useEvent(onInteractOutside),
    onPointerDownOutside: useEvent(onPointerDownOutside),
  }

  const [state, send] = useMachine(colorPicker.machine(initialContext), { context })
  return useMemo(() => colorPicker.connect(state, send, normalizeProps), [state, send])
}
