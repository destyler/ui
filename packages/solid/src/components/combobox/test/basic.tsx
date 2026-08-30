import type { Optional } from '~/types'
import { For } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Combobox, createListCollection } from '../'

interface Item {
  label: string
  value: string
  disabled?: boolean
}

export function ComponentUnderTest(props: Optional<Combobox.RootProps<Item>, 'collection'>) {
  const collection = createListCollection({
    items: [
      { label: 'React', value: 'react' },
      { label: 'Solid', value: 'solid' },
      { label: 'Vue', value: 'vue' },
      { label: 'Svelte', value: 'svelte', disabled: true },
    ],
  })
  return (
    <Combobox.Root collection={collection} {...props}>
      <Combobox.Label>Framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
        <Combobox.ClearTrigger>Clear</Combobox.ClearTrigger>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner data-testid="positioner">
          <Combobox.Content>
            <Combobox.ItemGroup>
              <Combobox.ItemGroupLabel>Frameworks</Combobox.ItemGroupLabel>
              <For each={collection.items}>
                {item => (
                  <Combobox.Item item={item}>
                    <Combobox.ItemText>{item.label}</Combobox.ItemText>
                    <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
                  </Combobox.Item>
                )}
              </For>
            </Combobox.ItemGroup>
            <Combobox.List />
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}
