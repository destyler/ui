import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureSegmentBaseProps extends PolymorphicProps {}
export interface SignatureSegmentProps extends HTMLProps<'svg'>, SignatureSegmentBaseProps {}

export const SignatureSegment = forwardRef<SVGSVGElement, SignatureSegmentProps>((props, ref) => {
  const signature = useSignatureContext()
  const mergedProps = mergeProps(signature.getSegmentProps(), props)

  return (
    <ui.svg {...mergedProps} ref={ref}>
      <title>Signature</title>
      {signature.paths.map((path, i) => (
        <path key={i} {...signature.getSegmentPathProps({ path })} />
      ))}
      {signature.currentPath && <path {...signature.getSegmentPathProps({ path: signature.currentPath })} />}
    </ui.svg>
  )
})

SignatureSegment.displayName = 'SignatureSegment'
