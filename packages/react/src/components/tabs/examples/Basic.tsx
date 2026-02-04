import { Tabs } from '../index'

interface BasicProps {
  defaultValue?: string
  onValueChange?: (details: { value: string }) => void
  loopFocus?: boolean
  orientation?: 'horizontal' | 'vertical'
  lazyMount?: boolean
  unmountOnExit?: boolean
}

const items = [
  { value: 'React' },
  { value: 'Solid' },
  { value: 'Svelte', disabled: true },
  { value: 'Vue' },
]

export function Basic(props: BasicProps) {
  return (
    <Tabs.Root {...props}>
      <Tabs.List>
        {items.map(item => (
          <Tabs.Trigger key={item.value} value={item.value} disabled={item.disabled}>
            {item.value}
            {' '}
            Trigger
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
      {items.map(item => (
        <Tabs.Content key={item.value} value={item.value}>
          {item.value}
          {' '}
          Content
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
