import { Format } from '../index'

const value = 50345.53
const unitDisplays = ['narrow', 'short', 'long'] as const

export function ByteWithUnitDisplay() {
  return (
    <div>
      {unitDisplays.map(unitDisplay => (
        <Format.Byte key={unitDisplay} value={value} unitDisplay={unitDisplay} />
      ))}
    </div>
  )
}
