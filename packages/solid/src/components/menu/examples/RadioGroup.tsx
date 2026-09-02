import { createSignal, For } from 'solid-js'
import { Menu } from '../index'

const items = ['React', 'Solid', 'Vue']

export function RadioGroup() {
  const [value, setValue] = createSignal('React')

  return (
    <Menu.Root>
      <Menu.Trigger>Open menu</Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.RadioItemGroup
            value={value()}
            onValueChange={({ value }) => setValue(value)}
          >
            <Menu.ItemGroupLabel>JS Frameworks</Menu.ItemGroupLabel>
            <For each={items}>
              {item => (
                <Menu.RadioItem value={item}>
                  <Menu.ItemIndicator>✅</Menu.ItemIndicator>
                  <Menu.ItemText>{item}</Menu.ItemText>
                </Menu.RadioItem>
              )}
            </For>
          </Menu.RadioItemGroup>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
