import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../namespace'
import type { EmitFn, Optional } from '~/types'
import * as otpInput from '@destyler/otp-input'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useFieldContext } from '~/components/field'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseOtpInputProps extends Optional<Omit<otpInput.Context, 'dir' | 'getRootNode' | 'value'>, 'id'> {
  /**
   * The initial value of the otp input when it is first rendered.
   * Use when you do not need to control the state of the otp input.
   */
  defaultValue?: otpInput.Context['value']
  modelValue?: otpInput.Context['value']
}

export interface UseOtpInputReturn extends ComputedRef<otpInput.Api<PropTypes>> {}

export function useOtpInput(props: UseOtpInputProps = {}, emit?: EmitFn<RootEmits>) {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const field = useFieldContext()

  const context = computed<otpInput.Context>(() => ({
    id,
    ids: {
      label: field?.value.ids.label,
      hiddenInput: field?.value.ids.control,
    },
    disabled: field?.value.disabled,
    readOnly: field?.value.readOnly,
    required: field?.value.required,
    invalid: field?.value.invalid,
    dir: locale.value.dir,
    value: props.modelValue ?? props.defaultValue,
    getRootNode: env?.value.getRootNode,
    onValueChange: (details) => {
      emit?.('valueChange', details)
      emit?.('update:modelValue', details.value)
    },
    onValueComplete: details => emit?.('valueComplete', details),
    onValueInvalid: details => emit?.('valueInvalid', details),
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(otpInput.machine(context.value), { context })

  return computed(() => otpInput.connect(state.value, send, normalizeProps))
}
