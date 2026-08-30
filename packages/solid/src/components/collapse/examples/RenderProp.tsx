import { Collapse } from '@destyler-ui/solid/collapse'
import { Index } from 'solid-js'

export function RenderProp() {
  const items = ['panel-1', 'panel-2', 'panel-3']
  return (
    <Collapse.Root>
      <Index each={items}>
        {item => (
          <Collapse.Item value={item()}>
            <Collapse.ItemContext>
              {api => (
                <>
                  <Collapse.ItemTrigger>
                    {api().expanded ? 'Expanded' : 'Closed'}
                  </Collapse.ItemTrigger>
                  <Collapse.ItemContent>{item()} content</Collapse.ItemContent>
                </>
              )}
            </Collapse.ItemContext>
          </Collapse.Item>
        )}
      </Index>
    </Collapse.Root>
  )
}
