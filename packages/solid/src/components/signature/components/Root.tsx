import type { UseSignatureProps } from '../hooks/use-signature'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSignature } from '../hooks/use-signature'
import { SignatureProvider } from '../hooks/use-signature-context'

export interface SignatureRootBaseProps extends UseSignatureProps, PolymorphicProps<'div'> {}
export interface SignatureRootProps extends HTMLProps<'div'>, SignatureRootBaseProps {}

export function SignatureRoot(props: SignatureRootProps) {
  const [useSignatureProps, localProps] = createSplitProps<UseSignatureProps>()(props, [
    'id',
    'ids',
    'drawing',
    'disabled',
    'readOnly',
    'name',
    'onDraw',
    'onDrawEnd',
    'readOnly',
    'required',
    'translations',
  ])

  const signature = useSignature(useSignatureProps)
  const mergedProps = mergeProps(() => signature().getRootProps(), localProps)

  return (
    <SignatureProvider value={signature}>
      <ui.div {...mergedProps} />
    </SignatureProvider>
  )
}
