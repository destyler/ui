import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureLabelBaseProps extends PolymorphicProps {}
export interface SignatureLabelProps extends HTMLProps<'label'>, SignatureLabelBaseProps {}

export const SignatureLabel = forwardRef<HTMLLabelElement, SignatureLabelProps>((props, ref) => {
  const signature = useSignatureContext()
  const mergedProps = mergeProps(signature.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

SignatureLabel.displayName = 'SignatureLabel'
