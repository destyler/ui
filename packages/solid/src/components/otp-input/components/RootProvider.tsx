import type { UseOtpInputReturn } from '../hooks/use-otp-input'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { OtpInputProvider } from '../hooks/use-otp-input-context'

interface RootProviderProps {
  value: UseOtpInputReturn
}

export interface OtpInputRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface OtpInputRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  OtpInputRootProviderBaseProps {}

export function OtpInputRootProvider(props: OtpInputRootProviderProps) {
  const [{ value: otpInput }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(() => otpInput().getRootProps(), localProps)

  return (
    <OtpInputProvider value={otpInput}>
      <ui.div {...mergedProps} />
    </OtpInputProvider>
  )
}
