<script lang="ts">
  import { untrack } from 'svelte'
  import { Calendar } from '$lib/components/calendar'

  let {
    child = false,
    bound = true,
    undefinedRef = false,
    onContentClick,
  }: {
    child?: boolean
    bound?: boolean
    undefinedRef?: boolean
    onContentClick?: (event: MouseEvent) => void
  } = $props()

  let ref = $state<Element | null | undefined>(untrack(() => undefinedRef ? undefined : null))
  let visible = $state(true)
  let firstChild = $state(true)
  let open = $state(true)
  let title = $state('initial')

  export function currentRef() { return ref }
  export function setVisible(value: boolean) { visible = value }
  export function setOpen(value: boolean) { open = value }
  export function replace() { firstChild = !firstChild }
  export function rename() { title = 'updated' }
</script>

<Calendar.Root id="calendar-ref" {open} unmountOnExit>
  <Calendar.Label>Date</Calendar.Label>
  <Calendar.Control>
    <Calendar.Input />
    <Calendar.Trigger>Open</Calendar.Trigger>
  </Calendar.Control>
  {#if visible}
    {#if !bound}
      <Calendar.Content data-testid="content" {title} onclick={onContentClick} />
    {:else if child}
      <Calendar.Content bind:ref data-testid="content" {title} onclick={onContentClick}>
        {#snippet asChild(props)}
          {#if firstChild}
            <div {...props()} data-child="first"></div>
          {:else}
            <div {...props()} data-child="replacement"></div>
          {/if}
        {/snippet}
      </Calendar.Content>
    {:else}
      <Calendar.Content bind:ref data-testid="content" {title} onclick={onContentClick} />
    {/if}
  {/if}
</Calendar.Root>
<output>{ref?.tagName ?? 'none'}</output>
