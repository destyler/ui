import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useQrCodeContext } from '../hooks/use-qr-code-context'

export interface QrCodePatternBaseProps extends PolymorphicProps {}
export interface QrCodePatternProps extends HTMLProps<'path'>, QrCodePatternBaseProps {}

export const QrCodePattern = forwardRef<SVGPathElement, QrCodePatternProps>((props, ref) => {
  const qrCode = useQrCodeContext()
  const mergedProps = mergeProps(qrCode.getPatternProps(), props)

  return <ui.path {...mergedProps} ref={ref} />
})

QrCodePattern.displayName = 'QrCodePattern'
