import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useOtpInputContext } from '../hooks/use-otp-input-context'

export interface OtpInputLabelBaseProps extends PolymorphicProps {}
export interface OtpInputLabelProps extends HTMLProps<'label'>, OtpInputLabelBaseProps {}

export const OtpInputLabel = forwardRef<HTMLLabelElement, OtpInputLabelProps>((props, ref) => {
  const otpInput = useOtpInputContext()
  const mergedProps = mergeProps(otpInput.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

OtpInputLabel.displayName = 'OtpInputLabel'
