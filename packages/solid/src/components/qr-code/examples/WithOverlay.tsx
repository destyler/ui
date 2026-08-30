import { QrCode } from '@destyler-ui/solid/qr-code'

export function WithOverlay() {
  return (
    <QrCode.Root defaultValue="http://ui-ui.com">
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
      <QrCode.Overlay>
        <img src="https://ui-ui.com/icon-192.png" alt="Destyler UI Logo" />
      </QrCode.Overlay>
    </QrCode.Root>
  )
}
