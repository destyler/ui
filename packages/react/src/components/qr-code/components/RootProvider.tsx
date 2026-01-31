import type { UseQrCodeReturn } from '../hooks/use-qr-code'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { QrCodeProvider } from '../hooks/use-qr-code-context'

interface RootProviderProps {
  value: UseQrCodeReturn
}

export interface QrCodeRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface QrCodeRootProviderProps extends HTMLProps<'div'>, QrCodeRootProviderBaseProps {}

export const QrCodeRootProvider = forwardRef<HTMLDivElement, QrCodeRootProviderProps>((props, ref) => {
  const [{ value: qrCode }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(qrCode.getRootProps(), localProps)

  return (
    <QrCodeProvider value={qrCode}>
      <ui.div {...mergedProps} ref={ref} />
    </QrCodeProvider>
  )
})

QrCodeRootProvider.displayName = 'QrCodeRootProvider'
