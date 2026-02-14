import { Edit } from '../index'

export function CustomControls() {
  return (
    <Edit.Root placeholder="Placeholder">
      <Edit.Label>Label</Edit.Label>
      <Edit.Area>
        <Edit.Input />
        <Edit.Preview />
      </Edit.Area>
      <Edit.Context>
        {(context) => (
          <>
            {context.editing ? (
              <Edit.Control>
                <Edit.SubmitTrigger>Save</Edit.SubmitTrigger>
                <Edit.CancelTrigger>Cancel</Edit.CancelTrigger>
              </Edit.Control>
            ) : (
              <Edit.Control>
                <Edit.EditTrigger>Edit</Edit.EditTrigger>
              </Edit.Control>
            )}
          </>
        )}
      </Edit.Context>
    </Edit.Root>
  )
}
