import { Checkbox } from '@destyler-ui/solid/checkbox'
import { CheckIcon } from 'lucide-solid'
import { For } from 'solid-js'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
]

export function Group() {
  return (
    <Checkbox.Group defaultValue={['react']} name="framework" onValueChange={console.warn}>
      <For each={items}>
        {item => (
          <Checkbox.Root value={item.value}>
            <Checkbox.Label>{item.label}</Checkbox.Label>
            <Checkbox.Control>
              <Checkbox.Indicator>
                <CheckIcon />
              </Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.HiddenInput />
          </Checkbox.Root>
        )}
      </For>
    </Checkbox.Group>
  )
}
