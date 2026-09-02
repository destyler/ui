import { Progress } from '@destyler-ui/solid/progress'

export function ValueText() {
  return (
    <Progress.Root
      translations={{
        value({ value, max }) {
          if (value === null)
            return 'Loading...'
          return `${value} of ${max} items loaded`
        },
      }}
    >
      <Progress.Label>Label</Progress.Label>
      <Progress.ValueText />
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
