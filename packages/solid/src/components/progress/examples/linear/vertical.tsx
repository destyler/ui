import { Progress } from '@destyler-ui/solid/progress'

export function Vertical() {
  return (
    <Progress.Root orientation="vertical">
      <Progress.Label>Label</Progress.Label>
      <Progress.ValueText />
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
