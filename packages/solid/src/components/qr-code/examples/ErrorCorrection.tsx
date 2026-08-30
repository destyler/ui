import { QrCode } from '@destyler-ui/solid/qr-code'

export function ErrorCorrection() {
  return (
    <QrCode.Root defaultValue="http://ui-ui.com" encoding={{ ecc: 'H' }}>
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
    </QrCode.Root>
  )
}
