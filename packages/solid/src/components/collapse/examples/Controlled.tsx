import { Collapse } from '@destyler-ui/solid/collapse'
import { createSignal, Index } from 'solid-js'

export function Controlled() {
  const [value, setValue] = createSignal<string[]>([])
  const items = ['panel-1', 'panel-2', 'panel-3']
  return (
    <Collapse.Root value={value()} onValueChange={details => setValue(details.value)}>
      <Index each={items}>
        {item => (
          <Collapse.Item value={item()}>
            <Collapse.ItemTrigger>{item()} trigger</Collapse.ItemTrigger>
            <Collapse.ItemContent>{item()} content</Collapse.ItemContent>
          </Collapse.Item>
        )}
      </Index>
    </Collapse.Root>
  )
}
