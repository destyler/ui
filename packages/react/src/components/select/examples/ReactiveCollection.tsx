import { useMemo, useState } from 'react'
import { Select } from '../index'
import { createListCollection } from '~/utils/collection'

const itemsBase = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Svelte', value: 'svelte', disabled: true },
  { label: 'Vue', value: 'vue' },
]

export function ReactiveCollection() {
  const [number, setNumber] = useState(0)

  const inc = () => setNumber(prev => prev + 1)
  const dec = () => setNumber(prev => prev - 1)

  const collection = useMemo(() => {
    const newItems = itemsBase.map(item => ({
      ...item,
      label: `${item.label}-${number}`,
    }))
    return createListCollection({ items: newItems })
  }, [number])

  return (
    <div>
      <button type="button" onClick={inc}>Inc</button>
      <button type="button" onClick={dec}>Dec</button>
      <Select.Root positioning={{ sameWidth: true }} collection={collection}>
        <Select.Label>Framework</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a Framework" />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            <Select.ItemGroup>
              <Select.ItemGroupLabel>Framework</Select.ItemGroupLabel>
              {collection.items.map(item => (
                <Select.Item key={item.value} item={item}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator>✅</Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.ItemGroup>
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </div>
  )
}
