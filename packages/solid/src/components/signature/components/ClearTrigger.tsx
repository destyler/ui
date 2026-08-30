import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureClearTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface SignatureClearTriggerProps
  extends HTMLProps<'button'>,
  SignatureClearTriggerBaseProps {}

export function SignatureClearTrigger(props: SignatureClearTriggerProps) {
  const signature = useSignatureContext()
  const mergedProps = mergeProps(() => signature().getClearTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
