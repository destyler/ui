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
            <Checkbox.Control>
              <Checkbox.Indicator>
                <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
                  <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.Label>{item.label}</Checkbox.Label>
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
