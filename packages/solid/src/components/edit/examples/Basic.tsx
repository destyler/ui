import { Edit } from '@destyler-ui/solid/edit'

export function Basic() {
  return (
    <Edit.Root placeholder="Placeholder">
      <Edit.Label>Label</Edit.Label>
      <Edit.Area>
        <Edit.Input />
        <Edit.Preview />
      </Edit.Area>
    </Edit.Root>
  )
}
