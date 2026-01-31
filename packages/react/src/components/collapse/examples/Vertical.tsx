import { Collapse } from '../index'

const items = ['React', 'Solid', 'Vue']

export function Vertical(props: Collapse.RootProps) {
  return (
    <Collapse.Root orientation="vertical" {...props}>
      {items.map(item => (
        <Collapse.Item key={item} value={item}>
          <Collapse.ItemTrigger>
            {item}
            {' '}
            trigger
          </Collapse.ItemTrigger>
          <Collapse.ItemContent>
            {item}
            {' '}
            content
          </Collapse.ItemContent>
        </Collapse.Item>
      ))}
    </Collapse.Root>
  )
}
