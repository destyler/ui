import { useState } from 'react'
import { Menu } from '../index'

const items = ['react', 'solid', 'vue', 'svelte']

export function Basic() {
  const [checked, setChecked] = useState(false)

  return (
    <Menu.Root>
      <Menu.Trigger>
        Open menu
        <Menu.Indicator />
      </Menu.Trigger>
      <Menu.ContextTrigger>Open Context Menu</Menu.ContextTrigger>
      <Menu.Positioner data-testid="positioner">
        <Menu.Content>
          <Menu.Arrow>
            <Menu.ArrowTip />
          </Menu.Arrow>
          <Menu.ItemGroup>
            <Menu.ItemGroupLabel>Destyler UI</Menu.ItemGroupLabel>
            <Menu.Item value="dialog" disabled>Dialog</Menu.Item>
          </Menu.ItemGroup>
          <Menu.Separator />
          <Menu.CheckboxItem
            checked={checked}
            onCheckedChange={(e) => setChecked(e as boolean)}
            value="my-checkbox"
          >
            <Menu.ItemIndicator>✅</Menu.ItemIndicator>
            <Menu.ItemText>Check me</Menu.ItemText>
          </Menu.CheckboxItem>
          <Menu.Separator />
          <Menu.RadioItemGroup>
            <Menu.ItemGroupLabel>JS Frameworks</Menu.ItemGroupLabel>
            {items.map(item => (
              <Menu.RadioItem key={item} value={item}>
                <Menu.ItemIndicator>✅</Menu.ItemIndicator>
                <Menu.ItemText>{item}</Menu.ItemText>
              </Menu.RadioItem>
            ))}
          </Menu.RadioItemGroup>
          <Menu.Separator />
          <Menu.Root>
            <Menu.TriggerItem>CSS Frameworks</Menu.TriggerItem>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="unocss">UnoCSS</Menu.Item>
                <Menu.Item value="tailwind">Tailwind</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
