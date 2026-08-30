import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureLabelBaseProps extends PolymorphicProps<'label'> {}
export interface SignatureLabelProps extends HTMLProps<'label'>, SignatureLabelBaseProps {}

export function SignatureLabel(props: SignatureLabelProps) {
  const signature = useSignatureContext()
  const mergedProps = mergeProps(() => signature().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}
