import { Toggle } from '@destyler-ui/solid/toggle'
import { BoldIcon } from 'lucide-solid'

export function Disabled() {
  return (
    <Toggle.Root disabled>
      <BoldIcon />
    </Toggle.Root>
  )
}
