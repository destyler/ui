import type { UseQrCodeReturn } from '../hooks/use-qr-code'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { QrCodeProvider } from '../hooks/use-qr-code-context'

interface RootProviderProps {
  value: UseQrCodeReturn
}

export interface QrCodeRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface QrCodeRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  QrCodeRootProviderBaseProps {}

export function QrCodeRootProvider(props: QrCodeRootProviderProps) {
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const qrCode = () => providerProps.value()
  const mergedProps = mergeProps(() => qrCode().getRootProps(), localProps)

  return (
    <QrCodeProvider value={qrCode}>
      <ui.div {...mergedProps} />
    </QrCodeProvider>
  )
}
