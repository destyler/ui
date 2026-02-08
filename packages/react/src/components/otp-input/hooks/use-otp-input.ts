import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as otpInput from '@destyler/otp-input'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useFieldContext } from '~/components/field'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseOtpInputProps extends Optional<Omit<otpInput.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the otp input when it is first rendered.
   * Use when you do not need to control the state of the otp input
   */
  defaultValue?: otpInput.Context['value']
}

export interface UseOtpInputReturn extends otpInput.Api<PropTypes> {}

export function useOtpInput(props: UseOtpInputProps = {}): UseOtpInputReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()
  const field = useFieldContext()

  const initialContext: otpInput.Context = {
    id: useId(),
    ids: {
      label: field?.ids.label,
      hiddenInput: field?.ids.control,
    },
    disabled: field?.disabled,
    readOnly: field?.readOnly,
    required: field?.required,
    invalid: field?.invalid,
    dir,
    getRootNode,
    value: props.defaultValue,
    ...props,
  }

  const context: otpInput.Context = {
    ...initialContext,
    value: props.value,
    onValueChange: useEvent(props.onValueChange, { sync: true }),
    onValueComplete: useEvent(props.onValueComplete),
    onValueInvalid: useEvent(props.onValueInvalid),
  }

  const [state, send] = useMachine(otpInput.machine(initialContext), { context })
  return otpInput.connect(state, send, normalizeProps)
}
