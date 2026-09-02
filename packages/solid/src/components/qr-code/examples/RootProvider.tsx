import { QrCode, useQrCode } from '@destyler-ui/solid/qr-code'

export function RootProvider() {
  const qrCode = useQrCode({ defaultValue: 'http://ui-ui.com' })

  return (
    <>
      <button onClick={() => qrCode().setValue('https://ui-ui().com')}>Set Value</button>

      <QrCode.RootProvider value={qrCode}>
        <QrCode.Frame>
          <QrCode.Pattern />
        </QrCode.Frame>
      </QrCode.RootProvider>
    </>
  )
}
