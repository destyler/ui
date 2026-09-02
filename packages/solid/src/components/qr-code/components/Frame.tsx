import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useQrCodeContext } from '../hooks/use-qr-code-context'

export interface QrCodeFrameBaseProps extends PolymorphicProps<'svg'> {}
export interface QrCodeFrameProps extends HTMLProps<'svg'>, QrCodeFrameBaseProps {}

export function QrCodeFrame(props: QrCodeFrameProps) {
  const qrCode = useQrCodeContext()
  const mergedProps = mergeProps(() => qrCode().getFrameProps(), props)

  return <ui.svg {...mergedProps} />
}
