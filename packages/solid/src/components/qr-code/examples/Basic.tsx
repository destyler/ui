import { QrCode } from '@destyler-ui/solid/qr-code'

export function Basic() {
  return (
    <QrCode.Root value="http://ui-ui.com">
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
      <QrCode.DownloadTrigger fileName="qr-code.png" mimeType="image/png">
        Download
      </QrCode.DownloadTrigger>
    </QrCode.Root>
  )
}
