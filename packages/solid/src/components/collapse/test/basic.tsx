import { ChevronRightIcon } from 'lucide-solid'
import { For } from 'solid-js'
import { Collapse } from '../'

export function ComponentUnderTest(props: Collapse.RootProps) {
  const items = [
    { value: 'React' },
    { value: 'Solid' },
    { value: 'Svelte', disabled: true },
    { value: 'Vue' },
  ]
  return (
    <Collapse.Root {...props}>
      <For each={items}>
        {item => (
          <Collapse.Item value={item.value} disabled={item.disabled}>
            <Collapse.ItemTrigger>
              {item.value} Trigger
              <Collapse.ItemIndicator>
                <ChevronRightIcon />
              </Collapse.ItemIndicator>
            </Collapse.ItemTrigger>
            <Collapse.ItemContent>{item.value} Content</Collapse.ItemContent>
          </Collapse.Item>
        )}
      </For>
    </Collapse.Root>
  )
}
