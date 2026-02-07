import { createListCollection } from '~/utils/collection'
import { Select, useSelect } from '../index'

const collection = createListCollection({
  items: ['React', 'Solid', 'Vue'],
})

export function RootProvider() {
  const select = useSelect({ collection })

  return (
    <>
      <button onClick={() => select.focus()}>Focus</button>

      <Select.RootProvider value={select}>
        <Select.Label>Framework</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a Framework" />
            <Select.Indicator>🔽</Select.Indicator>
          </Select.Trigger>
          <Select.ClearTrigger>Clear</Select.ClearTrigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            <Select.ItemGroup>
              <Select.ItemGroupLabel>Frameworks</Select.ItemGroupLabel>
              {collection.items.map(item => (
                <Select.Item key={item} item={item}>
                  <Select.ItemText>{item}</Select.ItemText>
                  <Select.ItemIndicator>✓</Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.ItemGroup>
          </Select.Content>
        </Select.Positioner>
        <Select.HiddenSelect />
      </Select.RootProvider>
    </>
  )
}
