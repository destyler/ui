import type { UseOtpInputProps } from '../hooks/use-otp-input'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useOtpInput } from '../hooks/use-otp-input'
import { OtpInputProvider } from '../hooks/use-otp-input-context'

export interface OtpInputRootBaseProps extends UseOtpInputProps, PolymorphicProps<'div'> {}
export interface OtpInputRootProps extends HTMLProps<'div'>, OtpInputRootBaseProps {}

export function OtpInputRoot(props: OtpInputRootProps) {
  const [useOtpInputProps, localProps] = createSplitProps<UseOtpInputProps>()(props, [
    'autoFocus',
    'blurOnComplete',
    'defaultValue',
    'disabled',
    'form',
    'id',
    'ids',
    'invalid',
    'mask',
    'name',
    'onValueChange',
    'onValueComplete',
    'onValueInvalid',
    'otp',
    'pattern',
    'placeholder',
    'readOnly',
    'required',
    'selectOnFocus',
    'translations',
    'type',
    'value',
  ])
  const otpInput = useOtpInput(useOtpInputProps)
  const mergedProps = mergeProps(() => otpInput().getRootProps(), localProps)

  return (
    <OtpInputProvider value={otpInput}>
      <ui.div {...mergedProps} />
    </OtpInputProvider>
  )
}
