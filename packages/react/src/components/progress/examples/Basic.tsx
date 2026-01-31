import { Progress } from '../index'

export function Basic() {
  return (
    <Progress.Root defaultValue={42}>
      <Progress.Label>Label</Progress.Label>
      <Progress.ValueText />
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
      <Progress.Circle>
        <Progress.CircleTrack />
        <Progress.CircleRange />
      </Progress.Circle>
    </Progress.Root>
  )
}
