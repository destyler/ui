import { QrCode } from '../..'

export function ComponentUnderTest() {
  return (
    <QrCode.Root value="http://ui-ui.com" encoding={{ ecc: 'H' }}>
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
      <QrCode.Overlay>
        <img src="https://ui-ui.com/icon-192.png" alt="" />
      </QrCode.Overlay>
      <QrCode.DownloadTrigger fileName="qr-code.png" mimeType="image/png">
        Download
      </QrCode.DownloadTrigger>
    </QrCode.Root>
  )
}
