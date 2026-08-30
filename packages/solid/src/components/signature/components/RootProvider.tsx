import type { UseSignatureReturn } from '../hooks/use-signature'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { SignatureProvider } from '../hooks/use-signature-context'

interface RootProviderProps {
  value: UseSignatureReturn
}

export interface SignatureRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface SignatureRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  SignatureRootProviderBaseProps {}

export function SignatureRootProvider(props: SignatureRootProviderProps) {
  const [{ value: signature }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ])
  const mergedProps = mergeProps(() => signature().getRootProps(), localProps)

  return (
    <SignatureProvider value={signature}>
      <ui.div {...mergedProps} />
    </SignatureProvider>
  )
}
