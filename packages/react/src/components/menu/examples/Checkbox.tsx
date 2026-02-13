import { useState } from 'react'
import { Menu } from '../index'

export function Checkbox() {
  const [checked, setChecked] = useState(true)

  return (
    <Menu.Root>
      <Menu.Trigger>Open menu</Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.CheckboxItem
            checked={checked}
            onCheckedChange={(e) => setChecked(e as boolean)}
            value="my-checkbox"
          >
            <Menu.ItemIndicator>✅</Menu.ItemIndicator>
            <Menu.ItemText>Check me</Menu.ItemText>
          </Menu.CheckboxItem>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
