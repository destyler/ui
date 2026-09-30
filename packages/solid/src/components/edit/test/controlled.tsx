import { createSignal } from 'solid-js'
import { Edit } from '../'

export function ControlledComponentUnderTest(props: Edit.RootProps) {
  const [value, setValue] = createSignal(typeof props.value === 'string' ? props.value : '')
  return (
    <>
      <button type="button" onClick={() => setValue('Solid')}>
        set value
      </button>
      <Edit.Root
        placeholder="Placeholder"
        {...props}
        value={value()}
        onValueChange={(details) => {
          setValue(details.value)
          props.onValueChange?.(details)
        }}
      >
        <Edit.Label>Label</Edit.Label>
        <Edit.Area>
          <Edit.Input aria-label="editable input" />
          <Edit.Preview />
        </Edit.Area>
        <Edit.Context>
          {context => (
            <Edit.Control>
              {context().editing
                ? (
                    <>
                      <Edit.SubmitTrigger>Save</Edit.SubmitTrigger>
                      <Edit.CancelTrigger>Cancel</Edit.CancelTrigger>
                    </>
                  )
                : (
                    <Edit.EditTrigger>Edit</Edit.EditTrigger>
                  )}
            </Edit.Control>
          )}
        </Edit.Context>
      </Edit.Root>
    </>
  )
}
