import { Dynamic } from '@destyler-ui/solid/dynamic'
import { Field } from '@destyler-ui/solid/field'
import { Index } from 'solid-js'

export function WithField(props: Field.RootProps) {
  return (
    <Field.Root {...props}>
      <Dynamic.Root>
        <Dynamic.Context>
          {dynamic => (
            <>
              <Dynamic.Label>Label</Dynamic.Label>
              <Index each={dynamic().value}>
                {(value, index) => (
                  <Dynamic.Item index={index} value={value()}>
                    <Dynamic.ItemPreview>
                      <Dynamic.ItemText>{value()}</Dynamic.ItemText>
                      <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
                    </Dynamic.ItemPreview>
                    <Dynamic.ItemInput />
                  </Dynamic.Item>
                )}
              </Index>
              <Dynamic.Input placeholder="Add Framework" />
              <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
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
