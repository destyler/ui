import { Toggle } from '@destyler-ui/solid/toggle'
import { Volume, VolumeOff } from 'lucide-solid'

export function Indicator() {
  return (
    <Toggle.Root>
      <Toggle.Indicator fallback={<Volume />}>
        <VolumeOff />
      </Toggle.Indicator>
    </Toggle.Root>
  )
}
