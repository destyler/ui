import { Progress } from '@destyler-ui/solid/progress'

export function InitialValue() {
  return (
    <Progress.Root defaultValue={70}>
      <Progress.Label>Label</Progress.Label>
      <Progress.ValueText />
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
