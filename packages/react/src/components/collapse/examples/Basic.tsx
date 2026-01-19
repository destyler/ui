import { Collapse } from '../'

export function Basic(props: Collapse.RootProps) {
  const items = [{ value: 'React' }, { value: 'Solid' }, { value: 'Svelte', disabled: true }, { value: 'Vue' }]
  return (
    <Collapse.Root {...props}>
      {items.map((item, id) => (
        <Collapse.Item key={id} value={item.value} disabled={item.disabled}>
          <Collapse.ItemTrigger>
            {item.value}
            {' '}
            Trigger
            <Collapse.ItemIndicator>
              ⬇️
            </Collapse.ItemIndicator>
          </Collapse.ItemTrigger>
          <Collapse.ItemContent>
            {item.value}
            {' '}
            Content
          </Collapse.ItemContent>
        </Collapse.Item>
      ))}
    </Collapse.Root>
  )
}
