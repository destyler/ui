import type { UseOtpInputReturn } from '../hooks/use-otp-input'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { OtpInputProvider } from '../hooks/use-otp-input-context'

interface RootProviderProps {
  value: UseOtpInputReturn
}

export interface OtpInputRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface OtpInputRootProviderProps extends HTMLProps<'div'>, OtpInputRootProviderBaseProps {}

export const OtpInputRootProvider = forwardRef<HTMLDivElement, OtpInputRootProviderProps>((props, ref) => {
  const [{ value: otpInput }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(otpInput.getRootProps(), localProps)

  return (
    <OtpInputProvider value={otpInput}>
      <ui.div {...mergedProps} ref={ref} />
    </OtpInputProvider>
  )
})

OtpInputRootProvider.displayName = 'OtpInputRootProvider'
