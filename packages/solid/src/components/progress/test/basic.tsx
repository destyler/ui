import { Progress } from '../'

export function ComponentUnderTest(props: Progress.RootProps) {
  return (
    <Progress.Root {...props}>
      <Progress.Label>Label</Progress.Label>
      <Progress.ValueText />
      <Progress.View state="loading" />
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
