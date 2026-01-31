import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useQrCodeContext } from '../hooks/use-qr-code-context'

export interface QrCodeFrameBaseProps extends PolymorphicProps {}
export interface QrCodeFrameProps extends HTMLProps<'svg'>, QrCodeFrameBaseProps {}

export const QrCodeFrame = forwardRef<SVGSVGElement, QrCodeFrameProps>((props, ref) => {
  const qrCode = useQrCodeContext()
  const mergedProps = mergeProps(qrCode.getFrameProps(), props)

  return <ui.svg {...mergedProps} ref={ref} />
})

QrCodeFrame.displayName = 'QrCodeFrame'
