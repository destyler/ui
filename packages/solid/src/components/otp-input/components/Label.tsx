import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useOtpInputContext } from '../hooks/use-otp-input-context'

export interface OtpInputLabelBaseProps extends PolymorphicProps<'label'> {}
export interface OtpInputLabelProps extends HTMLProps<'label'>, OtpInputLabelBaseProps {}

export function OtpInputLabel(props: OtpInputLabelProps) {
  const api = useOtpInputContext()
  const mergedProps = mergeProps(() => api().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}
