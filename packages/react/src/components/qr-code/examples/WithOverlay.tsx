import { QrCode } from '../index'

export function WithOverlay() {
  return (
    <QrCode.Root defaultValue="https://destyler.org">
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
      <QrCode.Overlay>
        <img src="https://destyler.org/favicon.svg" alt="Logo" />
      </QrCode.Overlay>
    </QrCode.Root>
  )
}
