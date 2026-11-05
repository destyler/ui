import * as qrCode from '@destyler/qr-code'
import { normalizeProps } from '@destyler/vue'

export const shortValue = 'short'
export const longValue = 'https://example.com/consumer-contract/'.repeat(12)

export function expectedQr(value: string) {
  const machine = qrCode.machine({ id: 'expected-svg-contract', value })
  const { encoded, pixelSize } = machine.state.context
  const size = encoded.size * pixelSize
  return {
    viewBox: `0 0 ${size} ${size}`,
    path: qrCode.connect(machine.state, machine.send, normalizeProps).getPatternProps().d,
  }
}
