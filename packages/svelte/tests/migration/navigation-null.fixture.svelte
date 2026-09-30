<script lang="ts">
  import { NavigationMenu, useNavigationMenu } from '$lib'
  import { untrack } from 'svelte'

  let { entry = 'root', value, defaultValue = 'one' }: {
    entry?: 'root' | 'provider' | 'hook'
    value?: string | null
    defaultValue?: string
  } = $props()
  const id = $props.id()
  const machineProps = $derived({ id, value, defaultValue, disableHoverTrigger: true })
  const api = untrack(() => entry === 'root' ? undefined : useNavigationMenu(() => machineProps))
</script>

{#if entry === 'root'}
  <NavigationMenu.Root {...machineProps}><NavigationMenu.Context render={parts} /></NavigationMenu.Root>
{:else if entry === 'provider' && api}
  <NavigationMenu.RootProvider value={api}>{@render parts(api)}</NavigationMenu.RootProvider>
{:else if api}
  {@render parts(api)}
{/if}

{#snippet parts(api: ReturnType<typeof useNavigationMenu>)}
  <output data-testid="api-value">{String(api().value)}</output>
  <output data-testid="api-open">{String(api().open)}</output>
  <button {...api().getTriggerProps({ value: 'one' })} data-testid="trigger">One</button>
  <div {...api().getContentProps({ value: 'one' })} data-testid="content">First</div>
  <div {...api().getViewportPositionerProps()} data-testid="viewport-positioner"></div>
{/snippet}
