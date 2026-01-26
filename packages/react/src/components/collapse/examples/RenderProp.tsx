import { Collapse } from '../index'

const items = ['React', 'Solid', 'Vue']

export function RenderProp() {
  return (
    <Collapse.Root>
      {items.map((item) => (
        <Collapse.Item key={item} value={item}>
          <Collapse.ItemContext>
            {({ expanded }) => (
              <>
                <Collapse.ItemTrigger>{expanded ? 'Expanded' : 'Closed'}</Collapse.ItemTrigger>
                <Collapse.ItemContent>{item} content</Collapse.ItemContent>
              </>
            )}
          </Collapse.ItemContext>
        </Collapse.Item>
      ))}
    </Collapse.Root>
  )
}
