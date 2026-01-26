import { Format } from '../index'

const byteSizes = [50, 5000, 5000000, 5000000000]

export function ByteSize() {
  return (
    <div>
      {byteSizes.map((size, index) => (
        <div key={index}>
          <Format.Byte value={size} />
        </div>
      ))}
    </div>
  )
}
