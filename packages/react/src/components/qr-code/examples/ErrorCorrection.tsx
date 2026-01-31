import { QrCode } from '../index'

export function ErrorCorrection() {
  return (
    <QrCode.Root
      defaultValue="https://destyler.org"
      encoding={{ ecc: 'H' }}
    >
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
    </QrCode.Root>
  )
}
