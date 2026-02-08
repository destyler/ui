import type { UseOtpInputProps } from '../hooks/use-otp-input'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { splitOtpInputProps } from '../hooks/split-otp-input-props'
import { useOtpInput } from '../hooks/use-otp-input'
import { OtpInputProvider } from '../hooks/use-otp-input-context'

export interface OtpInputRootBaseProps extends UseOtpInputProps, PolymorphicProps {}
export interface OtpInputRootProps extends Omit<HTMLProps<'div'>, 'defaultValue'>, OtpInputRootBaseProps {}

export const OtpInputRoot = forwardRef<HTMLDivElement, OtpInputRootProps>((props, ref) => {
  const [useOtpInputProps, localProps] = splitOtpInputProps(props)
  const otpInput = useOtpInput(useOtpInputProps)
  const mergedProps = mergeProps(otpInput.getRootProps(), localProps)

  return (
    <OtpInputProvider value={otpInput}>
      <ui.div {...mergedProps} ref={ref} />
    </OtpInputProvider>
  )
})

OtpInputRoot.displayName = 'OtpInputRoot'
