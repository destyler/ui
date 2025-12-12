import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as numberInput from '@destyler/number-input'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useFieldContext } from '~/components/field'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseNumberInputProps
  extends Optional<Omit<numberInput.Context, 'dir' | 'getRootNode' | 'value'>, 'id'> {
  modelValue?: numberInput.Context['value']
  /**
   * The initial value of the number input when it is first rendered.
   * Use when you do not need to control the state of the number input.
   */
  defaultValue?: numberInput.Context['value']
}
export interface UseNumberInputReturn extends ComputedRef<numberInput.Api<PropTypes>> {}

export function useNumberInput(props: UseNumberInputProps = {}, emit?: EmitFn<RootEmits>): UseNumberInputReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const field = useFieldContext()

  const context = computed<numberInput.Context>(() => ({
    id,
    ids: {
      label: field?.value.ids.label,
      input: field?.value.ids.control,
    },
    disabled: field?.value.disabled,
    readOnly: field?.value.readOnly,
    required: field?.value.required,
    invalid: field?.value.invalid,
    dir: locale.value.dir,
    locale: locale.value.locale,
    value: props.modelValue ?? props.defaultValue,
    getRootNode: env?.value.getRootNode,
    onValueChange: (details) => {
      emit?.('valueChange', details)
      emit?.('update:modelValue', details.value)
    },
    onFocusChange: details => emit?.('focusChange', details),
    onValueInvalid: details => emit?.('valueInvalid', details),
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(numberInput.machine(context.value), { context })

  return computed(() => numberInput.connect(state.value, send, normalizeProps))
}
