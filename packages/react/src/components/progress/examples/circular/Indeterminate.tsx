import { Progress } from '../../index'

export function Indeterminate() {
  return (
    <Progress.Root defaultValue={null}>
      <Progress.Label>Label</Progress.Label>
      <Progress.ValueText />
      <Progress.Circle>
        <Progress.CircleTrack />
        <Progress.CircleRange />
      </Progress.Circle>
    </Progress.Root>
  )
}
