import { Collapse } from '../index'

const items = ['React', 'Solid', 'Vue']

export function Multiple(props: Collapse.RootProps) {
  return (
    <Collapse.Root multiple {...props}>
      {items.map(item => (
        <Collapse.Item key={item} value={item}>
          <Collapse.ItemTrigger>
            {item}
            {' '}
            Trigger
            <Collapse.ItemIndicator>x</Collapse.ItemIndicator>
          </Collapse.ItemTrigger>
          <Collapse.ItemContent>
            {item}
            {' '}
            is a JavaScript library for building user interfaces.
          </Collapse.ItemContent>
        </Collapse.Item>
      ))}
    </Collapse.Root>
  )
}
