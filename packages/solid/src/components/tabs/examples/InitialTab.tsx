import { Tabs } from '@destyler-ui/solid/tabs'

export function InitialTab() {
  return (
    <Tabs.Root defaultValue="react">
      <Tabs.List>
        <Tabs.Trigger defaultValue="react">React</Tabs.Trigger>
        <Tabs.Trigger value="vue">Vue</Tabs.Trigger>
        <Tabs.Trigger value="solid">Solid</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content defaultValue="react">React Content</Tabs.Content>
      <Tabs.Content value="vue">Vue Content</Tabs.Content>
      <Tabs.Content value="solid">Solid Content</Tabs.Content>
    </Tabs.Root>
  )
}
