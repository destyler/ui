<script lang="ts">
  import { Checkbox, Collapsible, Progress, ScrollArea, Tabs } from '$lib'
</script>

<Checkbox.Root defaultChecked>
  <Checkbox.HiddenInput />
  <Checkbox.Control />
  <Checkbox.Label>Initially checked</Checkbox.Label>
</Checkbox.Root>

<Collapsible.Root defaultOpen>
  <Collapsible.Trigger>Details</Collapsible.Trigger>
  <Collapsible.Content>Initially open</Collapsible.Content>
</Collapsible.Root>

<Progress.Root defaultValue={42}>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>

<Tabs.Root defaultValue="second">
  <Tabs.List>
    <Tabs.Trigger value="first">First</Tabs.Trigger>
    <Tabs.Trigger value="second">Second</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="first">First panel</Tabs.Content>
  <Tabs.Content value="second">Second panel</Tabs.Content>
</Tabs.Root>

<ScrollArea.Root defaultScrollTop={40} defaultScrollLeft={25}>
  <ScrollArea.Viewport data-testid="viewport" style="width: 100px; height: 100px; overflow: auto;">
    <ScrollArea.Content style="width: 300px; height: 300px;">Scrollable</ScrollArea.Content>
  </ScrollArea.Viewport>
</ScrollArea.Root>
