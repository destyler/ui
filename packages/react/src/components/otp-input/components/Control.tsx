import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useOtpInputContext } from '../hooks/use-otp-input-context'

export interface OtpInputControlBaseProps extends PolymorphicProps {}
export interface OtpInputControlProps extends HTMLProps<'div'>, OtpInputControlBaseProps {}

export const OtpInputControl = forwardRef<HTMLDivElement, OtpInputControlProps>((props, ref) => {
  const otpInput = useOtpInputContext()
  const mergedProps = mergeProps(otpInput.getControlProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

OtpInputControl.displayName = 'OtpInputControl'
