import { Field } from '~/components/field'
import { createListCollection } from '~/utils/collection'
import { Combobox } from '../index'

const collection = createListCollection({
  items: ['React', 'Solid', 'Vue'],
})

interface WithFieldProps {
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
  required?: boolean
}

export function WithField(props: WithFieldProps) {
  return (
    <Field.Root disabled={props.disabled} readOnly={props.readOnly} invalid={props.invalid} required={props.required}>
      <Combobox.Root collection={collection} disabled={props.disabled} readOnly={props.readOnly}>
        <Combobox.Label>Label</Combobox.Label>
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
      </Combobox.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
