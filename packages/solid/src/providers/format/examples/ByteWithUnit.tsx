import { Format } from '@destyler-ui/solid/format'

export function ByteWithUnit() {
  const value = 1450.45
  const unit = 'bit'

  return (
    <div>
      File size: <Format.Byte value={value} unit={unit} />
    </div>
  )
}
