import { Combobox, createListCollection } from '@destyler-ui/solid/combobox'
import { createSignal, For } from 'solid-js'
import { Portal } from 'solid-js/web'

const collection = createListCollection({
  items: [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte', disabled: true },
  ],
})

export function Controlled() {
  const [value, setValue] = createSignal<string[]>(['vue'])

  return (
    <>
      <output>{value().join(', ')}</output>
      <Combobox.Root
        collection={collection}
        value={value()}
        onValueChange={details => setValue(details.value)}
      >
        <Combobox.Label>Framework</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input />
          <Combobox.Trigger>Open</Combobox.Trigger>
          <Combobox.ClearTrigger>Clear</Combobox.ClearTrigger>
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner>
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
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
    </>
  )
}
