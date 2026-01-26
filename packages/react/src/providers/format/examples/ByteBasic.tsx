import { Format } from '../index'

const value = 1450.45

export function ByteBasic() {
  return (
    <div>
      File size:
      <Format.Byte value={value} />
    </div>
  )
}
