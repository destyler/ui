import { QrCode, useQrCode } from '../index'

export function RootProvider() {
  const qrCode = useQrCode({ defaultValue: 'https://destyler.org' })

  return (
    <>
      <button onClick={() => qrCode.setValue('https://elonehoo.me')}>
        Set Value
      </button>

      <QrCode.RootProvider value={qrCode}>
        <QrCode.Frame>
          <QrCode.Pattern />
        </QrCode.Frame>
      </QrCode.RootProvider>
    </>
  )
}
