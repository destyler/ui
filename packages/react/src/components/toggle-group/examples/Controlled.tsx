import { useState } from 'react'
import { ToggleGroup } from '../index'

export function Controlled() {
  const [value, setValue] = useState('a')

  return (
    <ToggleGroup.Root value={value} onValueChange={({ value }) => setValue(value)}>
      <ToggleGroup.Item value="a">A</ToggleGroup.Item>
      <ToggleGroup.Item value="b">B</ToggleGroup.Item>
      <ToggleGroup.Item value="c">C</ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}
