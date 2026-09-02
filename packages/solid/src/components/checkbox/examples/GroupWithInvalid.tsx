import { Checkbox } from '@destyler-ui/solid/checkbox'
import { CheckIcon } from 'lucide-solid'
import { For } from 'solid-js'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
]

export function GroupWithInvalid() {
  return (
    <Checkbox.Group invalid>
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
  )
}
