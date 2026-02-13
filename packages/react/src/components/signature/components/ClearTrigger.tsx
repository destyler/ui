import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureClearTriggerBaseProps extends PolymorphicProps {}
export interface SignatureClearTriggerProps extends HTMLProps<'button'>, SignatureClearTriggerBaseProps {}

export const SignatureClearTrigger = forwardRef<HTMLButtonElement, SignatureClearTriggerProps>((props, ref) => {
  const signature = useSignatureContext()
  const mergedProps = mergeProps(signature.getClearTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

SignatureClearTrigger.displayName = 'SignatureClearTrigger'
