import { Collapse, useCollapse } from '../index'

const items = ['React', 'Solid', 'Vue']

export function RootProvider() {
  const collapse = useCollapse({ defaultValue: ['React'] })

  return (
    <>
      <button onClick={() => collapse.setValue(['Vue'])}>Set to Vue</button>

      <Collapse.RootProvider value={collapse}>
        {items.map((item) => (
          <Collapse.Item key={item} value={item}>
            <Collapse.ItemTrigger>
              What is {item}?
              <Collapse.ItemIndicator>x</Collapse.ItemIndicator>
            </Collapse.ItemTrigger>
            <Collapse.ItemContent>{item} is a JavaScript library for building user interfaces.</Collapse.ItemContent>
          </Collapse.Item>
        ))}
      </Collapse.RootProvider>
    </>
  )
}
