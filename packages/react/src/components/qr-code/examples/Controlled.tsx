import { useState } from 'react'
import { QrCode } from '../index'

export function Controlled() {
  const [value, setValue] = useState('https://destyler.org')

  return (
    <QrCode.Root value={value} onValueChange={({ value }) => setValue(value)}>
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
      <QrCode.DownloadTrigger fileName="qr-code.png" mimeType="image/png">
        Download
      </QrCode.DownloadTrigger>
    </QrCode.Root>
  )
}
