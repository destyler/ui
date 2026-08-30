import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as otpInput from '@destyler/otp-input'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useFieldContext } from '~/components/field'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseOtpInputProps
  extends Optional<Omit<otpInput.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the pin input when it is first rendered.
   * Use when you do not need to control the state of the pin input
   */
  defaultValue?: otpInput.Context['value']
}
export interface UseOtpInputReturn extends Accessor<otpInput.Api<PropTypes>> {}

export function useOtpInput(props: UseOtpInputProps = {}): UseOtpInputReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()
  const field = useFieldContext()

  const context = createMemo(() => ({
    id,
    ids: {
      label: field?.().ids.label,
      hiddenInput: field?.().ids.control,
    },
    disabled: field?.().disabled,
    readOnly: field?.().readOnly,
    required: field?.().required,
    invalid: field?.().invalid,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    value: props.defaultValue,
    ...props,
  }))
  const [state, send] = useMachine(otpInput.machine(context()), { context })

  return createMemo(() => otpInput.connect(state, send, normalizeProps))
}
