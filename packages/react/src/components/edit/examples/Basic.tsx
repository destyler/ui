import { Edit } from '../index'

export function Basic() {
  return (
    <Edit.Root placeholder="Placeholder">
      <Edit.Label>Label</Edit.Label>
      <Edit.Area>
        <Edit.Input aria-label="editable input" />
        <Edit.Preview />
      </Edit.Area>
      <Edit.Control>
        <Edit.SubmitTrigger>Save</Edit.SubmitTrigger>
        <Edit.CancelTrigger>Cancel</Edit.CancelTrigger>
        <Edit.EditTrigger>Edit</Edit.EditTrigger>
      </Edit.Control>
    </Edit.Root>
  )
}
