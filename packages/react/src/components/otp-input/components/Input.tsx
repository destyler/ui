import type { InputProps } from '@destyler/otp-input'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useOtpInputContext } from '../hooks/use-otp-input-context'

export interface OtpInputInputBaseProps extends InputProps, PolymorphicProps {}
export interface OtpInputInputProps extends HTMLProps<'input'>, OtpInputInputBaseProps {}

export const OtpInputInput = forwardRef<HTMLInputElement, OtpInputInputProps>((props, ref) => {
  const [inputProps, localProps] = createSplitProps<InputProps>()(props, ['index'])
  const otpInput = useOtpInputContext()
  const mergedProps = mergeProps(otpInput.getInputProps(inputProps), localProps)

  return <ui.input {...mergedProps} ref={ref} />
})

OtpInputInput.displayName = 'OtpInputInput'
