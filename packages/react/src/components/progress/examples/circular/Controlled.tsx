import { useState } from 'react'
import { Progress } from '../../index'

export function Controlled() {
  const [value, setValue] = useState(42)

  return (
    <Progress.Root value={value} onValueChange={({ value }) => setValue(value)}>
      <Progress.Label>Label</Progress.Label>
      <Progress.ValueText />
      <Progress.Circle>
        <Progress.CircleTrack />
        <Progress.CircleRange />
      </Progress.Circle>
    </Progress.Root>
  )
}
