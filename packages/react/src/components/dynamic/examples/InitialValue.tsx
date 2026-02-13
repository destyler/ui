import { useState } from 'react'
import { Dynamic } from '../index'

export function InitialValue() {
  const [frameworks, setFrameworks] = useState<string[]>(['React', 'Solid', 'Vue'])

  return (
    <Dynamic.Root value={frameworks} onValueChange={details => setFrameworks(details.value)}>
      <Dynamic.Context>
        {tagsInput => (
          <>
            <Dynamic.Label>Frameworks</Dynamic.Label>
            <Dynamic.Control>
              {tagsInput.value.map((value, index) => (
                <Dynamic.Item key={index} index={index} value={value}>
                  <Dynamic.ItemInput />
                  <Dynamic.ItemText>{value}</Dynamic.ItemText>
                  <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
                </Dynamic.Item>
              ))}
              <Dynamic.Input placeholder="Add Framework" />
              <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
            </Dynamic.Control>
          </>
        )}
      </Dynamic.Context>
      <Dynamic.HiddenInput />
    </Dynamic.Root>
  )
}
