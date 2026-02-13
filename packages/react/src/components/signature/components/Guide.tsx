import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureGuideBaseProps extends PolymorphicProps {}
export interface SignatureGuideProps extends HTMLProps<'div'>, SignatureGuideBaseProps {}

export const SignatureGuide = forwardRef<HTMLDivElement, SignatureGuideProps>((props, ref) => {
  const signature = useSignatureContext()
  const mergedProps = mergeProps(signature.getGuideProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

SignatureGuide.displayName = 'SignatureGuide'
