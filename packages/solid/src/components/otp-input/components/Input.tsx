import type { InputProps } from '@destyler/otp-input'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useOtpInputContext } from '../hooks/use-otp-input-context'

export interface OtpInputInputBaseProps extends InputProps, PolymorphicProps<'input'> {}
export interface OtpInputInputProps extends HTMLProps<'input'>, OtpInputInputBaseProps {}

export function OtpInputInput(props: OtpInputInputProps) {
  const [inputProps, localProps] = createSplitProps<InputProps>()(props, ['index'])
  const api = useOtpInputContext()
  const mergedProps = mergeProps(
    () => ({ readOnly: undefined, ...api().getInputProps(inputProps) }),
    localProps,
  )

  return <ui.input {...mergedProps} />
}
