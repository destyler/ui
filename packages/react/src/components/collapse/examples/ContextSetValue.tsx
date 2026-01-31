import { Collapse } from '../index'

const items = ['React', 'Solid', 'Vue']

export function ContextSetValue() {
  return (
    <Collapse.Root defaultValue={['React']}>
      <Collapse.Context>
        {context => (
          <button onClick={() => context.setValue(['Vue'])}>Select Vue</button>
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
