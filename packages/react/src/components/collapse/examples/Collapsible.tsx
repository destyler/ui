import { Collapse } from '../index'

const items = ['React', 'Solid', 'Vue']

export function Collapsible(props: Collapse.RootProps) {
  return (
    <Collapse.Root collapsible {...props}>
      {items.map((item) => (
        <Collapse.Item key={item} value={item}>
          <Collapse.ItemTrigger>
            {item} Trigger
            <Collapse.ItemIndicator>x</Collapse.ItemIndicator>
          </Collapse.ItemTrigger>
          <Collapse.ItemContent>{item} is a JavaScript library for building user interfaces.</Collapse.ItemContent>
        </Collapse.Item>
      ))}
    </Collapse.Root>
  )
}
