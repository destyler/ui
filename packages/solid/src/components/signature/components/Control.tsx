import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureControlBaseProps extends PolymorphicProps<'div'> {}
export interface SignatureControlProps extends HTMLProps<'div'>, SignatureControlBaseProps {}

export function SignatureControl(props: SignatureControlProps) {
  const signature = useSignatureContext()
  const mergedProps = mergeProps(() => signature().getControlProps(), props)

  return <ui.div {...mergedProps} />
}
