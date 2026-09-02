import type { UseQrCodeProps } from '../hooks/use-qr-code'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useQrCode } from '../hooks/use-qr-code'
import { QrCodeProvider } from '../hooks/use-qr-code-context'

export interface QrCodeRootBaseProps extends UseQrCodeProps, PolymorphicProps<'div'> {}
export interface QrCodeRootProps extends HTMLProps<'div'>, QrCodeRootBaseProps {}

export function QrCodeRoot(props: QrCodeRootProps) {
  const [useQrCodeProps, restProps] = createSplitProps<UseQrCodeProps>()(props, [
    'defaultValue',
    'encoding',
    'id',
    'ids',
    'onValueChange',
    'value',
  ])

  const api = useQrCode(useQrCodeProps)
  const mergedProps = mergeProps(() => api().getRootProps(), restProps)

  return (
    <QrCodeProvider value={api}>
      <ui.div {...mergedProps} />
    </QrCodeProvider>
  )
}
