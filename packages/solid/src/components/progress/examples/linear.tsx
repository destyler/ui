import { Progress } from '../index'

export function Linear() {
  return (
    <Progress.Root defaultValue={42}>
      <Progress.Label>Label</Progress.Label>
      <Progress.ValueText />
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}

export { Linear as linear }
