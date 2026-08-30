import { Checkbox } from '@destyler-ui/solid/checkbox'
import { CheckIcon, MinusIcon } from 'lucide-solid'
import { createMemo, createSignal, For, splitProps } from 'solid-js'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
]

function CheckboxItem(props: Checkbox.RootProps) {
  const [local, rootProps] = splitProps(props, ['children'])

  return (
    <Checkbox.Root {...rootProps}>
      <Checkbox.Control>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        <Checkbox.Indicator indeterminate>
          <MinusIcon />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label>{local.children}</Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  )
}

export function GroupWithSelectAll() {
  const [value, setValue] = createSignal<string[]>([])
  const allSelected = createMemo(() => value().length === items.length)
  const indeterminate = createMemo(() => value().length > 0 && value().length < items.length)

  const handleSelectAll = (checked: boolean) => {
    setValue(checked ? items.map(item => item.value) : [])
  }

  return (
    <div style={{ 'display': 'flex', 'flex-direction': 'column', 'gap': '10px' }}>
      <CheckboxItem
        value="all"
        checked={indeterminate() ? 'indeterminate' : allSelected()}
        onCheckedChange={details => handleSelectAll(!!details.checked)}
      >
        Select All
      </CheckboxItem>

      <Checkbox.Group value={value} name="framework" onValueChange={setValue}>
        <For each={items}>
          {item => <CheckboxItem value={item.value}>{item.label}</CheckboxItem>}
        </For>
      </Checkbox.Group>

      <pre>Selected: {JSON.stringify(value())}</pre>
    </div>
  )
}
