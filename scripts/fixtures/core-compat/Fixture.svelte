<script>
  import { Dialog, Menu, Popover, Tabs } from '@destyler-ui/svelte'
  const { options } = $props()
  const rootProps = $derived.by(() => {
    const props = { ...options }
    delete props.component
    return props
  })
</script>

{#if options.component === 'popover'}
  <Popover.Root {...rootProps}>
    <Popover.Trigger>Open</Popover.Trigger>
    <Popover.Positioner><Popover.Content><Popover.Title>Compatibility</Popover.Title><Popover.CloseTrigger>Close</Popover.CloseTrigger></Popover.Content></Popover.Positioner>
  </Popover.Root>
{:else if options.component === 'menu'}
  <Menu.Root {...rootProps}>
    <Menu.Trigger>Open</Menu.Trigger>
    <Menu.Positioner><Menu.Content><Menu.Item value="alpha">Alpha</Menu.Item></Menu.Content></Menu.Positioner>
  </Menu.Root>
{:else if options.component === 'tabs'}
  <Tabs.Root {...rootProps}>
    <Tabs.List>
      <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
      <Tabs.Trigger value="beta">Beta</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="alpha">Alpha</Tabs.Content>
    <Tabs.Content value="beta">Beta</Tabs.Content>
  </Tabs.Root>
{:else}
  <Dialog.Root {...rootProps}>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Positioner><Dialog.Content><Dialog.Title>Compatibility</Dialog.Title><Dialog.CloseTrigger>Close</Dialog.CloseTrigger></Dialog.Content></Dialog.Positioner>
  </Dialog.Root>
{/if}
