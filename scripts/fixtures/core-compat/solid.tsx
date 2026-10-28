import { Dialog, Menu, Popover, Tabs } from '@destyler-ui/solid'
import { render } from 'solid-js/web'

function tree(props) {
  const { component = 'dialog', ...rootProps } = props
  if (component === 'popover') {
    return (
      <Popover.Root {...rootProps}>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Positioner><Popover.Content><Popover.Title>Compatibility</Popover.Title><Popover.CloseTrigger>Close</Popover.CloseTrigger></Popover.Content></Popover.Positioner>
      </Popover.Root>
    )
  }
  if (component === 'menu') {
    return (
      <Menu.Root {...rootProps}>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Positioner><Menu.Content><Menu.Item value="alpha">Alpha</Menu.Item></Menu.Content></Menu.Positioner>
      </Menu.Root>
    )
  }
  if (component === 'tabs') {
    return (
      <Tabs.Root {...rootProps}>
        <Tabs.List>
          <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
          <Tabs.Trigger value="beta">Beta</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="alpha">Alpha</Tabs.Content>
        <Tabs.Content value="beta">Beta</Tabs.Content>
      </Tabs.Root>
    )
  }
  return (
    <Dialog.Root {...rootProps}>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Positioner><Dialog.Content><Dialog.Title>Compatibility</Dialog.Title><Dialog.CloseTrigger>Close</Dialog.CloseTrigger></Dialog.Content></Dialog.Positioner>
    </Dialog.Root>
  )
}

export function mount(target, props) {
  return render(() => tree(props), target)
}
