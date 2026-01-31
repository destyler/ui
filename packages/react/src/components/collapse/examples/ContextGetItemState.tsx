import { Collapse } from '../index'

const items = [{ value: 'React' }, { value: 'Solid', disabled: true }, { value: 'Vue' }]

export function ContextGetItemState() {
  return (
    <Collapse.Root defaultValue={['React']}>
      <Collapse.Context>
        {context => (
          <>
            <b>Vue State:</b>
            <span>
              Disabled:
              {' '}
              {context.getItemState(items[2]).disabled ? 'Y' : 'N'}
            </span>
            <span>
              Expanded:
              {' '}
              {context.getItemState(items[2]).expanded ? 'Y' : 'N'}
            </span>
            <span>
              Focused:
              {' '}
              {context.getItemState(items[2]).focused ? 'Y' : 'N'}
            </span>
          </>
        )}
      </Collapse.Context>
      {items.map(item => (
        <Collapse.Item key={item.value} value={item.value} disabled={item.disabled}>
          <Collapse.ItemTrigger>
            What is
            {' '}
            {item.value}
            ?
            <Collapse.ItemIndicator>x</Collapse.ItemIndicator>
          </Collapse.ItemTrigger>
          <Collapse.ItemContent>
            {item.value}
            {' '}
            is a JavaScript library for building user interfaces.
          </Collapse.ItemContent>
        </Collapse.Item>
      ))}
    </Collapse.Root>
  )
}
