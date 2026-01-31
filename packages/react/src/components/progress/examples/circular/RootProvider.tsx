import { Progress, useProgress } from '../../index'

export function RootProvider() {
  const progress = useProgress({ defaultValue: 42 })

  return (
    <>
      <button onClick={() => progress.setToMax()}>Set to MAX</button>
      <Progress.RootProvider value={progress}>
        <Progress.Label>Label</Progress.Label>
        <Progress.ValueText />
        <Progress.Circle>
          <Progress.CircleTrack />
          <Progress.CircleRange />
        </Progress.Circle>
      </Progress.RootProvider>
    </>
  )
}
