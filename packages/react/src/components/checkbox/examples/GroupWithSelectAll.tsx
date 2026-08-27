import { useState } from 'react'
import { Checkbox } from '../index'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
]

function CheckboxItem({ children, ...props }: Checkbox.RootProps) {
  return (
    <Checkbox.Root {...props}>
      <Checkbox.Control>
        <Checkbox.Indicator>
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
            <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Checkbox.Indicator>
        <Checkbox.Indicator indeterminate>
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
            <path d="M3 7H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label>{children}</Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  )
}

export function GroupWithSelectAll() {
  const [value, setValue] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    setValue(checked ? items.map(item => item.value) : [])
  }

  const allSelected = value.length === items.length
  const indeterminate = value.length > 0 && value.length < items.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CheckboxItem
        value="all"
        checked={indeterminate ? 'indeterminate' : allSelected}
        onCheckedChange={e => handleSelectAll(!!e.checked)}
      >
        Select All
      </CheckboxItem>

      <Checkbox.Group value={value} name="framework" onValueChange={setValue}>
        {items.map(item => (
          <CheckboxItem value={item.value} key={item.value}>
            {item.label}
          </CheckboxItem>
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
