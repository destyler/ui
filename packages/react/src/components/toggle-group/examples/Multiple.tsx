import { useState } from 'react'
import { ToggleGroup } from '../index'

export function Multiple() {
  const [value, setValue] = useState<string[]>(['a', 'b'])

  return (
    <ToggleGroup.Root value={value} onValueChange={({ value }) => setValue(value)} multiple>
      <ToggleGroup.Item value="a">A</ToggleGroup.Item>
      <ToggleGroup.Item value="b">B</ToggleGroup.Item>
      <ToggleGroup.Item value="c">C</ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}
