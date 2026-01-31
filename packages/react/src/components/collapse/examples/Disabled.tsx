import { Collapse } from '../index'

const items = ['React', 'Solid', 'Vue']

export function Disabled() {
  return (
    <Collapse.Root>
      {items.map(item => (
        <Collapse.Item key={item} value={item} disabled={item === 'React'}>
          <Collapse.ItemTrigger>
            {item}
            {' '}
            Trigger
          </Collapse.ItemTrigger>
          <Collapse.ItemContent>
            {item}
            {' '}
            Content
          </Collapse.ItemContent>
        </Collapse.Item>
      ))}
    </Collapse.Root>
  )
}
