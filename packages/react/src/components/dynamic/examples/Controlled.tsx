import { useState } from 'react'
import { Dynamic } from '../index'

export function Controlled() {
  const [value, setValue] = useState(['react', 'solid', 'vue'])

  return (
    <>
      <output>{value.join(', ')}</output>
      <Dynamic.Root value={value} onValueChange={details => setValue(details.value)}>
        <Dynamic.Context>
          {tagsInput => (
            <>
              <Dynamic.Label>Frameworks</Dynamic.Label>
              <Dynamic.Control>
                {tagsInput.value.map((item, index) => (
                  <Dynamic.Item key={index} index={index} value={item}>
                    <Dynamic.ItemPreview>
                      <Dynamic.ItemText>{item}</Dynamic.ItemText>
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
    </>
  )
}
