import { Format } from '@destyler-ui/solid/format'

export function ByteBasic() {
  return (
    <div>
      File size: <Format.Byte value={1450.45} />
    </div>
  )
}
