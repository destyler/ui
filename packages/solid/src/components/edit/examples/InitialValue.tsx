import { Edit } from '@destyler-ui/solid/edit'

export function InitialValue() {
  return (
    <Edit.Root placeholder="Placeholder" defaultValue="Hello">
      <Edit.Label>Label</Edit.Label>
      <Edit.Area>
        <Edit.Input />
        <Edit.Preview />
      </Edit.Area>
    </Edit.Root>
  )
}
