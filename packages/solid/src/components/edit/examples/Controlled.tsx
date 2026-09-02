import { Edit } from '@destyler-ui/solid/edit'
import { createSignal, mergeProps, Show } from 'solid-js'

interface ControlledProps {
  activationMode?: 'focus' | 'click' | 'dblclick'
  placeholder?: string
}

export function Controlled(props: ControlledProps) {
  const mergedProps = mergeProps(
    {
      activationMode: 'click' as const,
      placeholder: 'Placeholder',
    },
    props,
  )
  const [value, setValue] = createSignal('')

  return (
    <Edit.Root
      placeholder={mergedProps.placeholder}
      activationMode={mergedProps.activationMode}
      value={value()}
      onValueChange={details => setValue(details.value)}
    >
      <Edit.Label>Label</Edit.Label>
      <Edit.Area>
        <Edit.Input aria-label="editable input" />
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
              <Edit.CancelTrigger>Cancel</Edit.CancelTrigger>
            </Show>
          </Edit.Control>
        )}
      </Edit.Context>
    </Edit.Root>
  )
}
