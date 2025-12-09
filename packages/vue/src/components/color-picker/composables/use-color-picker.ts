import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as colorPicker from '@destyler/color-picker'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useFieldContext } from '~/components/field'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseColorPickerProps
  extends Optional<Omit<colorPicker.Context, 'dir' | 'getRootNode' | 'open.controlled' | 'value'>, 'id'> {
  /**
   * The v-model value of the color picker
   */
  modelValue?: colorPicker.Context['value']
  /**
   * The initial open state of the color picker.
   */
  defaultOpen?: colorPicker.Context['open']
  /**
   * The initial value of the color picker when it is first rendered.
   * Use when you do not need to control the state of the color picker.
   */
  defaultValue?: colorPicker.Context['value']
}
export interface UseColorPickerReturn extends ComputedRef<colorPicker.Api<PropTypes>> {}

export function useColorPicker(props: UseColorPickerProps = {}, emit?: EmitFn<RootEmits>): UseColorPickerReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const field = useFieldContext()

  const context = computed<colorPicker.Context>(() => ({
    id,
    'ids': {
      label: field?.value.ids.label,
      input: field?.value.ids.control,
    },
    'disabled': field?.value.disabled,
    'invalid': field?.value.invalid,
    'readOnly': field?.value.readOnly,
    'required': field?.value.required,
    'dir': locale.value.dir,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    'value': props.defaultValue ?? props.modelValue,
    'getRootNode': env?.value.getRootNode,
    onOpenChange(details) {
      emit?.('openChange', details)
      emit?.('update:open', details.open)
    },
    onValueChange(details) {
      emit?.('valueChange', details)
      emit?.('update:modelValue', details.value)
    },
    'onFocusOutside': details => emit?.('focusOutside', details),
    'onFormatChange': details => emit?.('formatChange', details),
    'onInteractOutside': details => emit?.('interactOutside', details),
    'onPointerDownOutside': details => emit?.('pointerDownOutside', details),
    'onValueChangeEnd': details => emit?.('valueChangeEnd', details),
    ...cleanProps(props),
  }))
  const [state, send] = useMachine(colorPicker.machine(context.value), { context })

  return computed(() => colorPicker.connect(state.value, send, normalizeProps))
}
