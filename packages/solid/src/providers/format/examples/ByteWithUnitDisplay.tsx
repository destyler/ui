import { Format } from '@destyler-ui/solid/format'
import { For } from 'solid-js'

export function ByteWithUnitDisplay() {
  const value = 50345.53
  const unitDisplays = ['narrow', 'short', 'long'] as const

  return (
    <div>
      <For each={unitDisplays}>
        {unitDisplay => <Format.Byte value={value} unitDisplay={unitDisplay} />}
      </For>
    </div>
  )
}
