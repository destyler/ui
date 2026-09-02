import { QrCode } from '@destyler-ui/solid/qr-code'
import { createSignal } from 'solid-js'

export function Controlled() {
  const [value, setValue] = createSignal('http://ui-ui.com')

  return (
    <QrCode.Root value={value()} onValueChange={e => setValue(e.value)}>
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
    </QrCode.Root>
  )
}
