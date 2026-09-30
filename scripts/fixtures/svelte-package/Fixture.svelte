<script lang="ts">
  import { Collapsible, Toggle } from '@destyler-ui/svelte'
  const { changes }: { changes: { pressed: boolean[], open: boolean[] } } = $props()
</script>
<main>
  <Toggle.Root id="packed-toggle" defaultPressed={false} onPressedChange={value => changes.pressed.push(value)}>Toggle</Toggle.Root>
  <Collapsible.Root id="packed-collapse" defaultOpen={false} onOpenChange={details => changes.open.push(details.open)}>
    <Collapsible.Trigger>Details</Collapsible.Trigger>
    <Collapsible.Content>Packed content</Collapsible.Content>
  </Collapsible.Root>
</main>
