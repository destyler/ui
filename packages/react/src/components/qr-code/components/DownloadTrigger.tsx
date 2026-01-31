import type { DownloadTriggerProps } from '@destyler/qr-code'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useQrCodeContext } from '../hooks/use-qr-code-context'

export interface QrCodeDownloadTriggerBaseProps extends DownloadTriggerProps, PolymorphicProps {}
export interface QrCodeDownloadTriggerProps extends HTMLProps<'button'>, QrCodeDownloadTriggerBaseProps {}

export const QrCodeDownloadTrigger = forwardRef<HTMLButtonElement, QrCodeDownloadTriggerProps>((props, ref) => {
  const [downloadTriggerProps, localProps] = createSplitProps<DownloadTriggerProps>()(props, [
    'fileName',
    'mimeType',
    'quality',
  ])
  const qrCode = useQrCodeContext()
  const mergedProps = mergeProps(qrCode.getDownloadTriggerProps(downloadTriggerProps), localProps)

  return <ui.button {...mergedProps} ref={ref} />
})

QrCodeDownloadTrigger.displayName = 'QrCodeDownloadTrigger'
