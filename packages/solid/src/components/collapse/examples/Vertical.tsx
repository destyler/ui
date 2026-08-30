import { Collapse } from '@destyler-ui/solid/collapse'
import { Index } from 'solid-js'

export function Vertical() {
  const items = ['panel-1', 'panel-2', 'panel-3']
  return (
    <Collapse.Root orientation="vertical">
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
