import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useQrCodeContext } from '../hooks/use-qr-code-context'

export interface QrCodeOverlayBaseProps extends PolymorphicProps<'div'> {}
export interface QrCodeOverlayProps extends HTMLProps<'div'>, QrCodeOverlayBaseProps {}

export function QrCodeOverlay(props: QrCodeOverlayProps) {
  const qrCode = useQrCodeContext()
  const mergedProps = mergeProps(() => qrCode().getOverlayProps(), props)

  return <ui.div {...mergedProps} />
}
