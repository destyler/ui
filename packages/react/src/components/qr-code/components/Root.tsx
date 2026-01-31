import type { UseQrCodeProps } from '../hooks/use-qr-code'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useQrCode } from '../hooks/use-qr-code'
import { QrCodeProvider } from '../hooks/use-qr-code-context'

export interface QrCodeRootBaseProps extends UseQrCodeProps, PolymorphicProps {}
export interface QrCodeRootProps extends Assign<HTMLProps<'div'>, QrCodeRootBaseProps> {}

export const QrCodeRoot = forwardRef<HTMLDivElement, QrCodeRootProps>((props, ref) => {
  const [qrcodeProps, localProps] = createSplitProps<UseQrCodeProps>()(props, [
    'defaultValue',
    'encoding',
    'id',
    'ids',
    'onValueChange',
    'value',
  ])
  const qrCode = useQrCode(qrcodeProps)
  const mergedProps = mergeProps(qrCode.getRootProps(), localProps)

  return (
    <QrCodeProvider value={qrCode}>
      <ui.div {...mergedProps} ref={ref} />
    </QrCodeProvider>
  )
})

QrCodeRoot.displayName = 'QrCodeRoot'
