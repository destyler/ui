import { Toggle } from '@destyler-ui/solid/toggle'
import { Volume, VolumeOff } from 'lucide-solid'
import { createSignal, Show } from 'solid-js'

export function Controlled() {
  const [pressed, setPressed] = createSignal(false)
  return (
    <div>
      <Toggle.Root pressed={pressed} onPressedChange={setPressed}>
        <Show when={pressed()} fallback={<VolumeOff />}>
          <Volume />
        </Show>
      </Toggle.Root>
      <p>Volume is {pressed() ? 'unmuted' : 'muted'}</p>
    </div>
  )
}
