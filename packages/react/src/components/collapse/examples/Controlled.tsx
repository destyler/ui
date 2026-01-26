import { useState } from 'react'
import { Collapse } from '../index'

const items = ['React', 'Solid', 'Vue']

export function Controlled() {
  const [value, setValue] = useState(['Vue'])

  return (
    <>
      <div>{value.join(', ')}</div>
      <Collapse.Root value={value} onValueChange={(details) => setValue(details.value)}>
        {items.map((item) => (
          <Collapse.Item key={item} value={item}>
            <Collapse.ItemTrigger>{item} trigger</Collapse.ItemTrigger>
            <Collapse.ItemContent>{item} content</Collapse.ItemContent>
          </Collapse.Item>
        ))}
      </Collapse.Root>
    </>
  )
}
