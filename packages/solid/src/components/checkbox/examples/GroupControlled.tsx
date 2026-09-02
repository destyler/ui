import { Checkbox } from '@destyler-ui/solid/checkbox'
import { CheckIcon } from 'lucide-solid'
import { createSignal, For } from 'solid-js'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
]

export function GroupControlled() {
  const [value, setValue] = createSignal(['react'])

  return (
    <div>
      <Checkbox.Group value={value} name="framework" onValueChange={setValue}>
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
      <pre>Selected: {JSON.stringify(value())}</pre>
    </div>
  )
}
