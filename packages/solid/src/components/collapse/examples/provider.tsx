import { Collapse, useCollapse } from '@destyler-ui/solid/collapse'
import { ChevronDownIcon } from 'lucide-solid'
import { Index } from 'solid-js'

export function Provider() {
  const collapse = useCollapse({
    defaultValue: ['React'],
    onValueChange: details => console.warn(details),
  })

  return (
    <Collapse.RootProvider value={collapse}>
      <Index each={['React', 'Solid', 'Vue']}>
        {item => (
          <Collapse.Item value={item()}>
            <Collapse.ItemTrigger>
              What is {item()}?
              <Collapse.ItemIndicator>
                <ChevronDownIcon />
              </Collapse.ItemIndicator>
            </Collapse.ItemTrigger>
            <Collapse.ItemContent>
              {item()} is a JavaScript library for building user interfaces.
            </Collapse.ItemContent>
          </Collapse.Item>
        )}
      </Index>
    </Collapse.RootProvider>
  )
}
