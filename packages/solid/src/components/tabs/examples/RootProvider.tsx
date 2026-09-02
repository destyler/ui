import { Tabs, useTabs } from '@destyler-ui/solid/tabs'

export function RootProvider() {
  const tabs = useTabs()

  return (
    <>
      <button onClick={() => tabs().focus()}>Focus</button>

      <Tabs.RootProvider value={tabs}>
        <Tabs.List>
          <Tabs.Trigger value="react">React</Tabs.Trigger>
          <Tabs.Trigger value="vue">Vue</Tabs.Trigger>
          <Tabs.Trigger value="solid">Solid</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="react">React Content</Tabs.Content>
        <Tabs.Content value="vue">Vue Content</Tabs.Content>
        <Tabs.Content value="solid">Solid Content</Tabs.Content>
      </Tabs.RootProvider>
    </>
  )
}
