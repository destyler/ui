import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useOtpInputContext } from '../hooks/use-otp-input-context'

export interface OtpInputHiddenInputBaseProps extends PolymorphicProps {}
export interface OtpInputHiddenInputProps extends HTMLProps<'input'>, OtpInputHiddenInputBaseProps {}

export const OtpInputHiddenInput = forwardRef<HTMLInputElement, OtpInputHiddenInputProps>((props, ref) => {
  const otpInput = useOtpInputContext()
  const mergedProps = mergeProps(otpInput.getHiddenInputProps(), props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.ariaDescribedby} {...mergedProps} ref={ref} />
})

OtpInputHiddenInput.displayName = 'OtpInputHiddenInput'
