import { Progress } from '../../index'

export function Indeterminate() {
  return (
    <Progress.Root defaultValue={null}>
      <Progress.Label>Label</Progress.Label>
      <Progress.ValueText />
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
