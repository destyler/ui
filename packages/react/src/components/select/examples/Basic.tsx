import { createListCollection } from '~/utils/collection'
import { Select } from '../index'

const collection = createListCollection({
  items: [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte', disabled: true },
  ],
})

interface BasicProps {
  disabled?: boolean
  multiple?: boolean
  onValueChange?: (value: string[]) => void
  onOpenChange?: (open: boolean) => void
  readOnly?: boolean
  lazyMount?: boolean
  unmountOnExit?: boolean
}

export function Basic(props: BasicProps) {
  return (
    <Select.Root
      collection={collection}
      disabled={props.disabled}
      multiple={props.multiple}
      onValueChange={props.onValueChange}
      onOpenChange={props.onOpenChange}
      readOnly={props.readOnly}
      lazyMount={props.lazyMount}
      unmountOnExit={props.unmountOnExit}
    >
      <Select.Label>Framework</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select a Framework" />
          <Select.Indicator>ChevronDownIcon</Select.Indicator>
        </Select.Trigger>
        <Select.ClearTrigger>Clear</Select.ClearTrigger>
      </Select.Control>
      <Select.Positioner data-testid="positioner">
        <Select.Content>
          <Select.ItemGroup>
            <Select.ItemGroupLabel>Frameworks</Select.ItemGroupLabel>
            {collection.items.map(item => (
              <Select.Item key={item.value} item={item}>
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator>✓</Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.ItemGroup>
          <Select.List />
        </Select.Content>
      </Select.Positioner>
      <Select.HiddenSelect />
    </Select.Root>
  )
}
