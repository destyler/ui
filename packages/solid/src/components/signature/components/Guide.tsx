import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureGuideBaseProps extends PolymorphicProps<'div'> {}
export interface SignatureGuideProps extends HTMLProps<'div'>, SignatureGuideBaseProps {}

export function SignatureGuide(props: SignatureGuideProps) {
  const signature = useSignatureContext()
  const mergedProps = mergeProps(() => signature().getGuideProps(), props)

  return <ui.div {...mergedProps} />
}
