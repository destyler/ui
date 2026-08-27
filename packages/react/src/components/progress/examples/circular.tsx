import { Progress } from '../index'

export function Circular() {
  return (
    <Progress.Root defaultValue={42}>
      <Progress.Label>Label</Progress.Label>
      <Progress.ValueText />
      <Progress.Circle>
        <Progress.CircleTrack />
        <Progress.CircleRange />
      </Progress.Circle>
    </Progress.Root>
  )
}

export { Circular as circular }
