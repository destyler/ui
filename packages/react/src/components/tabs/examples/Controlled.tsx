import { useState } from 'react'
import { Tabs } from '../index'

export function Controlled() {
  const [value, setValue] = useState('react')

  return (
    <Tabs.Root value={value} onValueChange={({ value }) => setValue(value)}>
      <Tabs.List>
        <Tabs.Trigger value="react">React</Tabs.Trigger>
        <Tabs.Trigger value="vue">Vue</Tabs.Trigger>
        <Tabs.Trigger value="solid">Solid</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="react">React Content</Tabs.Content>
      <Tabs.Content value="vue">Vue Content</Tabs.Content>
      <Tabs.Content value="solid">Solid Content</Tabs.Content>
    </Tabs.Root>
  )
}
