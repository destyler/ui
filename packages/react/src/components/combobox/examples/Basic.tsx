import { useState } from 'react'
import { createListCollection } from '~/utils/collection'
import { Combobox } from '../index'

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
  onValueChange?: (details: { value: string[] }) => void
  onOpenChange?: (details: { open: boolean }) => void
  readOnly?: boolean
  lazyMount?: boolean
  unmountOnExit?: boolean
}

export function Basic(props: BasicProps) {
  const [value, setValue] = useState<string[]>([])

  const handleValueChange = (details: { value: string[] }) => {
    setValue(details.value)
    props.onValueChange?.(details)
  }

  return (
    <Combobox.Root
      collection={collection}
      value={value}
      onValueChange={handleValueChange}
      onOpenChange={props.onOpenChange}
      disabled={props.disabled}
      readOnly={props.readOnly}
      lazyMount={props.lazyMount}
      unmountOnExit={props.unmountOnExit}
    >
      <Combobox.Label>Framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input data-testid="input" />
        <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
        <Combobox.ClearTrigger>Clear</Combobox.ClearTrigger>
      </Combobox.Control>
      <Combobox.Positioner data-testid="positioner">
        <Combobox.Content>
          <Combobox.ItemGroup>
            <Combobox.ItemGroupLabel>Frameworks</Combobox.ItemGroupLabel>
            {collection.items.map(item => (
              <Combobox.Item key={item.value} item={item}>
                <Combobox.ItemText>{item.label}</Combobox.ItemText>
                <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
              </Combobox.Item>
            ))}
          </Combobox.ItemGroup>
          <Combobox.List />
        </Combobox.Content>
      </Combobox.Positioner>
    </Combobox.Root>
  )
}
