import { Edit } from '@destyler-ui/solid/edit'
import { Show } from 'solid-js'

export function CustomControls() {
  return (
    <Edit.Root placeholder="enter a value" value="Chakra">
      <Edit.Label>Label</Edit.Label>
      <Edit.Area>
        <Edit.Input />
        <Edit.Preview />
      </Edit.Area>
      <Edit.Context>
        {edit => (
          <Edit.Control>
            <Show
              when={edit().editing}
              fallback={<Edit.EditTrigger>Edit</Edit.EditTrigger>}
            >
              <Edit.SubmitTrigger>Save</Edit.SubmitTrigger>
              <Edit.CancelTrigger>Canvel</Edit.CancelTrigger>
            </Show>
          </Edit.Control>
        )}
      </Edit.Context>
    </Edit.Root>
  )
}
