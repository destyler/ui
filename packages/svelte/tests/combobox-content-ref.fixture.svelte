<script lang="ts">
  import { untrack } from 'svelte'
  import { Combobox, createListCollection } from '$lib/components/combobox'

  const collection = createListCollection({ items: ['React', 'Svelte'] })

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

<Combobox.Root {collection} id="combobox-ref" {open} unmountOnExit>
  <Combobox.Label>Date</Combobox.Label>
  <Combobox.Control>
    <Combobox.Input />
    <Combobox.Trigger>Open</Combobox.Trigger>
  </Combobox.Control>
  {#if visible}
    {#if !bound}
      <Combobox.Content data-testid="content" {title} onclick={onContentClick} />
    {:else if child}
      <Combobox.Content bind:ref data-testid="content" {title} onclick={onContentClick}>
        {#snippet asChild(props)}
          {#if firstChild}
            <div {...props()} data-child="first"></div>
          {:else}
            <div {...props()} data-child="replacement"></div>
          {/if}
        {/snippet}
      </Combobox.Content>
    {:else}
      <Combobox.Content bind:ref data-testid="content" {title} onclick={onContentClick} />
    {/if}
  {/if}
</Combobox.Root>
<output>{ref?.tagName ?? 'none'}</output>
