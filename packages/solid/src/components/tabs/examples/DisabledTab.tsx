import { Tabs } from '@destyler-ui/solid/tabs'

export function DisabledTab() {
  return (
    <Tabs.Root value="react">
      <Tabs.List>
        <Tabs.Trigger value="react">React</Tabs.Trigger>
        <Tabs.Trigger value="vue" disabled>
          Vue
        </Tabs.Trigger>
        <Tabs.Trigger value="solid">Solid</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="react">React Content</Tabs.Content>
      <Tabs.Content value="vue">Vue Content</Tabs.Content>
      <Tabs.Content value="solid">Solid Content</Tabs.Content>
    </Tabs.Root>
  )
}
