import { Format } from '../index'

const value = 1450.45
const unit = 'bit'

export function ByteWithUnit() {
  return (
    <div>
      File size:
      <Format.Byte value={value} unit={unit} />
    </div>
  )
}
