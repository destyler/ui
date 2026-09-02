import { Progress } from '@destyler-ui/solid/progress'
import { createSignal } from 'solid-js'

export function Controlled() {
  const [value, setValue] = createSignal<number | null>(42)

  return (
    <Progress.Root value={value()} onValueChange={e => setValue(e.value)}>
      <Progress.Label>Label</Progress.Label>
      <Progress.ValueText />
      <Progress.Circle>
        <Progress.CircleTrack />
        <Progress.CircleRange />
      </Progress.Circle>
    </Progress.Root>
  )
}
