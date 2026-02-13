import { useState } from 'react'
import { Dynamic } from '../index'

export function Basic() {
  const [frameworks, setFrameworks] = useState<string[]>(['react', 'solid', 'vue'])

  return (
    <Dynamic.Root value={frameworks} onValueChange={details => setFrameworks(details.value)}>
      <Dynamic.Context>
        {tagsInput => (
          <>
            <Dynamic.Label>Frameworks</Dynamic.Label>
            <Dynamic.Control>
              {tagsInput.value.map((value, index) => (
                <Dynamic.Item key={index} index={index} value={value}>
                  <Dynamic.ItemPreview>
                    <Dynamic.ItemText>{value}</Dynamic.ItemText>
                    <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
                  </Dynamic.ItemPreview>
                  <Dynamic.ItemInput />
                </Dynamic.Item>
              ))}
              <Dynamic.Input placeholder="Add tag" />
              <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
            </Dynamic.Control>
          </>
        )}
      </Dynamic.Context>
      <Dynamic.HiddenInput />
    </Dynamic.Root>
  )
}
