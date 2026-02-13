import { Field } from '~/components/field'
import { Dynamic } from '../index'

export interface WithFieldProps {
  invalid?: boolean
}

export function WithField({ invalid }: WithFieldProps = {}) {
  return (
    <Field.Root invalid={invalid}>
      <Dynamic.Root>
        <Dynamic.Context>
          {tagsInput => (
            <>
              <Dynamic.Label>Label</Dynamic.Label>
              <Dynamic.Control>
                {tagsInput.value.map((value, index) => (
                  <Dynamic.Item key={index} index={index} value={value}>
                    <Dynamic.ItemPreview>
                      <Dynamic.ItemText>{value}</Dynamic.ItemText>
                      <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
                    </Dynamic.ItemPreview>
                    <Dynamic.ItemInput />
                  </Dynamic.Item>
                ))}
                <Dynamic.Input placeholder="Add Framework" />
                <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
              </Dynamic.Control>
            </>
          )}
        </Dynamic.Context>
        <Dynamic.HiddenInput />
      </Dynamic.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
