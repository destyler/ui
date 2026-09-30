import { QrCode } from '../index'

export function InitialValue() {
  return (
    <QrCode.Root defaultValue="https://destyler.org">
      <QrCode.Frame>
        <QrCode.Pattern data-testid="pattern" />
      </QrCode.Frame>
      <QrCode.Overlay>
        <img src="https://github.com/elonehoo.png" alt="" />
      </QrCode.Overlay>
      <QrCode.DownloadTrigger fileName="qr-code.png" mimeType="image/png">
        Download
      </QrCode.DownloadTrigger>
    </QrCode.Root>
  )
}
