import { QrCode } from '@destyler-ui/solid/qr-code'

export function InitialValue() {
  return (
    <QrCode.Root defaultValue="https://destyler.org">
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
      <QrCode.DownloadTrigger fileName="qr-code.png" mimeType="image/png">
        Download
      </QrCode.DownloadTrigger>
    </QrCode.Root>
  )
}
