<script lang="ts">
  import { Tabs } from '../index'

  const { mode, onChange }: {
    mode: 'accept' | 'veto' | 'delay' | 'binding' | 'uncontrolled'
    onChange: (details: { value: string | null }) => void
  } = $props()
  let value = $state<string | null>('alpha')
  let pending = $state<string | null | undefined>(undefined)

  function handleChange(details: { value: string | null }) {
    onChange(details)
    if (mode === 'accept') value = details.value
    if (mode === 'delay') pending = details.value
  }

  function acceptPending() {
    if (pending !== undefined) value = pending
  }
</script>

<button data-action="parent-clear" onclick={() => { value = null }}>Parent clear</button>
<button data-action="parent-restore" onclick={() => { value = 'alpha' }}>Parent restore</button>
<button data-action="parent-accept" onclick={acceptPending}>Accept pending</button>
<output data-value="parent">{value ?? 'none'}</output>

{#snippet content()}
  <Tabs.Context>
    {#snippet render(tabs)}
      <button data-action="api-clear" onclick={() => tabs().clearValue()}>API clear</button>
      <button data-action="api-alpha" onclick={() => tabs().setValue('alpha')}>API select alpha</button>
      <button data-action="api-beta" onclick={() => tabs().setValue('beta')}>API select beta</button>
      <output data-value="api">{tabs().value ?? 'none'}</output>
    {/snippet}
  </Tabs.Context>
  <Tabs.List>
    <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
    <Tabs.Trigger value="beta">Beta</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="alpha">Alpha content</Tabs.Content>
  <Tabs.Content value="beta">Beta content</Tabs.Content>
{/snippet}

{#if mode === 'binding'}
  <Tabs.Root bind:value deselectable activationMode="manual" onValueChange={handleChange}>
    {@render content()}
  </Tabs.Root>
{:else}
  <Tabs.Root
    value={mode === 'uncontrolled' ? undefined : value}
    defaultValue="alpha"
    deselectable
    activationMode="manual"
    onValueChange={handleChange}
  >
    {@render content()}
  </Tabs.Root>
{/if}
