<script lang="ts">
  import type { Entry, OpenApi, OpenFamily } from './open-cases'
  import { createListCollection } from '$lib'
  import { untrack } from 'svelte'
  import { openCases } from './open-cases'
  import OpenParts from './open-parts.fixture.svelte'

  let {
    family, entry = 'root', open, defaultOpen, unrelated = 0, onOpenChange,
  }: {
    family: OpenFamily
    entry?: Entry
    open?: boolean
    defaultOpen?: boolean
    unrelated?: number
    onOpenChange?: (details: { open: boolean }) => void
  } = $props()
  const selected = untrack(() => openCases[family])
  const Root = selected.components.Root
  const RootProvider = selected.components.RootProvider
  const Context = selected.components.Context
  const collection = createListCollection({ items: ['one', 'two'] })
  const id = $props.id()
  const machineProps = $derived({
    id,
    open,
    defaultOpen,
    onOpenChange,
    ...(family === 'select' || family === 'combobox' ? { collection } : {}),
    ...(family === 'dialog' || family === 'popover' ? { modal: false, preventScroll: false } : {}),
    closeOnInteractOutside: false,
    onInteractOutside: (event: Event) => event.preventDefault(),
    ...(family === 'hover-card' || family === 'tooltip' ? { openDelay: 0, closeDelay: 0 } : {}),
  })
  const hook = untrack(() => entry === 'root' ? undefined : selected.use(() => machineProps))
</script>

{#snippet renderParts(api: () => OpenApi)}
  <OpenParts {api} {family} />
{/snippet}

<div data-unrelated={unrelated}>
  {#if entry === 'root'}
    <Root {...machineProps}>
      <Context render={renderParts} children={renderParts} />
    </Root>
  {:else if entry === 'provider' && hook}
    <RootProvider value={hook}>
      <Context render={renderParts} children={renderParts} />
    </RootProvider>
  {:else if hook}
    <OpenParts api={() => family === 'menu' ? hook().api : hook()} {family} />
  {/if}
</div>
