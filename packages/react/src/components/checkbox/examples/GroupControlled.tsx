import { useState } from 'react'
import { Checkbox } from '../index'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
]

export function GroupControlled() {
  const [value, setValue] = useState(['react'])
  return (
    <div>
      <Checkbox.Group value={value} name="framework" onValueChange={setValue}>
        {items.map(item => (
          <Checkbox.Root value={item.value} key={item.value}>
            <Checkbox.Label>{item.label}</Checkbox.Label>
            <Checkbox.Control>
              <Checkbox.Indicator>
                x
              </Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.HiddenInput />
          </Checkbox.Root>
        ))}
      </Checkbox.Group>
      <pre>
        Selected:
        {' '}
        {JSON.stringify(value)}
      </pre>
    </div>
  )
}
