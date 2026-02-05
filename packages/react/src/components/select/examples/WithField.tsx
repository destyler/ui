import { Field } from '~/components/field'
import { Select } from '../index'
import { createListCollection } from '~/utils/collection'

const collection = createListCollection({
  items: ['React', 'Solid', 'Vue'],
})

interface WithFieldProps {
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
}

export function WithField(props: WithFieldProps) {
  return (
    <Field.Root disabled={props.disabled} readOnly={props.readOnly} invalid={props.invalid}>
      <Select.Root collection={collection} disabled={props.disabled} readOnly={props.readOnly}>
        <Select.Label>Label</Select.Label>
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
      </Select.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
