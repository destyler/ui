import { useMemo, useState } from 'react'
import { createListCollection } from '~/utils/collection'
import { Combobox, useCombobox } from '../index'

const initialItems = ['React', 'Solid', 'Vue']

export function RootProvider() {
  const [items, setItems] = useState(initialItems)

  const collection = useMemo(() => createListCollection({ items }), [items])

  const combobox = useCombobox({
    collection,
    onInputValueChange: ({ inputValue }) => {
      setItems(initialItems.filter(item => item.toLowerCase().includes(inputValue.toLowerCase())))
    },
  })

  return (
    <>
      <button type="button" onClick={() => combobox.focus()}>Focus</button>

      <Combobox.RootProvider value={combobox}>
        <Combobox.Label>Framework</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input />
          <Combobox.Trigger>Open</Combobox.Trigger>
          <Combobox.ClearTrigger>Clear</Combobox.ClearTrigger>
        </Combobox.Control>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.ItemGroup>
              <Combobox.ItemGroupLabel>Frameworks</Combobox.ItemGroupLabel>
              {collection.items.map(item => (
                <Combobox.Item key={item} item={item}>
                  <Combobox.ItemText>{item}</Combobox.ItemText>
                  <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
                </Combobox.Item>
              ))}
            </Combobox.ItemGroup>
            <Combobox.List />
          </Combobox.Content>
        </Combobox.Positioner>
      </Combobox.RootProvider>
    </>
  )
}
