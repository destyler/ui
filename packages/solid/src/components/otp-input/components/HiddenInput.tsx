import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useOtpInputContext } from '../hooks/use-otp-input-context'

export interface OtpInputHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface OtpInputHiddenInputProps
  extends HTMLProps<'input'>,
  OtpInputHiddenInputBaseProps {}

export function OtpInputHiddenInput(props: OtpInputHiddenInputProps) {
  const otpInput = useOtpInputContext()
  const mergedProps = mergeProps(() => otpInput().getHiddenInputProps(), props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />
}
