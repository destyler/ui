import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useOtpInputContext } from '../hooks/use-otp-input-context'

export interface OtpInputControlBaseProps extends PolymorphicProps<'div'> {}
export interface OtpInputControlProps extends HTMLProps<'div'>, OtpInputControlBaseProps {}

export function OtpInputControl(props: OtpInputControlProps) {
  const api = useOtpInputContext()
  const mergedProps = mergeProps(() => api().getControlProps(), props)

  return <ui.div {...mergedProps} />
}
