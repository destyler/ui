import { Edit } from '../'

export function ControlledComponentUnderTest(props: Edit.RootProps) {
  return (
    <Edit.Root placeholder="Placeholder" {...props}>
      <Edit.Label>Label</Edit.Label>
      <Edit.Area>
        <Edit.Input />
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
  )
}
