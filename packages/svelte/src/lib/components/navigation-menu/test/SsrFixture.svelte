<script lang="ts">
  import type { NavigationMenuRootProps } from '../index'
  import { EnvironmentProvider } from '$lib/providers/environment'
  import Basic from '../examples/Basic.svelte'
  import ProviderFixture from './ProviderFixture.svelte'

  const { provider = false, ...props }: NavigationMenuRootProps & { provider?: boolean } = $props()
  function rejectDocument(): never {
    throw new Error('NavigationMenu SSR must not read the environment root')
  }
</script>

<EnvironmentProvider value={rejectDocument}>
  {#if provider}
    <ProviderFixture {...props} id={props.id ?? 'ssr-provider'} />
  {:else}
    <Basic {...props} />
  {/if}
</EnvironmentProvider>
