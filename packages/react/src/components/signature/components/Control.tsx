import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureControlBaseProps extends PolymorphicProps {}
export interface SignatureControlProps extends HTMLProps<'div'>, SignatureControlBaseProps {}

export const SignatureControl = forwardRef<HTMLDivElement, SignatureControlProps>((props, ref) => {
  const signature = useSignatureContext()
  const mergedProps = mergeProps(signature.getControlProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

SignatureControl.displayName = 'SignatureControl'
