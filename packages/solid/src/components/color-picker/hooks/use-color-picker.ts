import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as colorPicker from '@destyler/color-picker'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useFieldContext } from '~/components/field'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseColorPickerProps
  extends Optional<Omit<colorPicker.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
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
export interface UseColorPickerReturn extends Accessor<colorPicker.Api<PropTypes>> {}

export function useColorPicker(props: UseColorPickerProps = {}): UseColorPickerReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const field = useFieldContext()
  const id = createUniqueId()

  const context = createMemo(() => ({
    id,
    'ids': {
      label: field?.().ids.label,
      input: field?.().ids.control,
    },
    'dir': locale().dir,
    'disabled': field?.().disabled,
    'invalid': field?.().invalid,
    'readOnly': field?.().readOnly,
    'required': field?.().required,
    'getRootNode': environment().getRootNode,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    'value': props.defaultValue,
    ...props,
  }))
  const [state, send] = useMachine(colorPicker.machine(context()), { context })

  return createMemo(() => colorPicker.connect(state, send, normalizeProps))
}
