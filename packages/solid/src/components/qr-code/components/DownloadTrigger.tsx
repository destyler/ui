import type { DownloadTriggerProps } from '@destyler/qr-code'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useQrCodeContext } from '../hooks/use-qr-code-context'

export interface QrCodeDownloadTriggerBaseProps
  extends DownloadTriggerProps,
  PolymorphicProps<'button'> {}
export interface QrCodeDownloadTriggerProps
  extends HTMLProps<'button'>,
  QrCodeDownloadTriggerBaseProps {}

export function QrCodeDownloadTrigger(props: QrCodeDownloadTriggerProps) {
  const [downloadTriggerProps, localProps] = createSplitProps<DownloadTriggerProps>()(props, [
    'fileName',
    'mimeType',
    'quality',
  ])
  const qrCode = useQrCodeContext()
  const mergedProps = mergeProps(
    () => qrCode().getDownloadTriggerProps(downloadTriggerProps),
    localProps,
  )

  return <ui.button {...mergedProps} />
}
