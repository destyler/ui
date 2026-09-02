import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useQrCodeContext } from '../hooks/use-qr-code-context'

export interface QrCodePatternBaseProps extends PolymorphicProps<'path'> {}
export interface QrCodePatternProps extends HTMLProps<'path'>, QrCodePatternBaseProps {}

export function QrCodePattern(props: QrCodePatternProps) {
  const qrCode = useQrCodeContext()
  const mergedProps = mergeProps(() => qrCode().getPatternProps(), props)

  return <ui.path {...mergedProps} />
}
