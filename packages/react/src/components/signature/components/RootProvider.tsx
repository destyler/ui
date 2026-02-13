import type { UseSignatureReturn } from '../hooks/use-signature'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { SignatureProvider } from '../hooks/use-signature-context'

interface RootProviderProps {
  value: UseSignatureReturn
}

export interface SignatureRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface SignatureRootProviderProps extends HTMLProps<'div'>, SignatureRootProviderBaseProps {}

export const SignatureRootProvider = forwardRef<HTMLDivElement, SignatureRootProviderProps>((props, ref) => {
  const [{ value: signature }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(signature.getRootProps(), localProps)

  return (
    <SignatureProvider value={signature}>
      <ui.div {...mergedProps} ref={ref} />
    </SignatureProvider>
  )
})

SignatureRootProvider.displayName = 'SignatureRootProvider'
