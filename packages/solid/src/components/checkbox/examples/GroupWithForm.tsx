import { Checkbox } from '@destyler-ui/solid/checkbox'
import { CheckIcon } from 'lucide-solid'
import { For } from 'solid-js'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
]

export function GroupWithForm() {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        // eslint-disable-next-line no-console
        console.log(new FormData(event.currentTarget).getAll('framework'))
      }}
    >
      <Checkbox.Group defaultValue={['react']} name="framework">
        <For each={items}>
          {item => (
            <Checkbox.Root value={item.value}>
              <Checkbox.Control>
                <Checkbox.Indicator>
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox.Control>
              <Checkbox.Label>{item.label}</Checkbox.Label>
              <Checkbox.HiddenInput />
            </Checkbox.Root>
          )}
        </For>
      </Checkbox.Group>
      <button type="submit">Submit</button>
    </form>
  )
}
