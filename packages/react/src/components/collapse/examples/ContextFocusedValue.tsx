import { Collapse } from '../index'

const items = ['React', 'Solid', 'Vue']

export function ContextFocusedValue() {
  return (
    <Collapse.Root defaultValue={['React']}>
      <Collapse.Context>
        {context => (
          <span>
            Focused item:
            {context.focusedValue}
          </span>
        )}
      </Collapse.Context>
      {items.map(item => (
        <Collapse.Item key={item} value={item}>
          <Collapse.ItemTrigger>
            What is
            {' '}
            {item}
            ?
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
