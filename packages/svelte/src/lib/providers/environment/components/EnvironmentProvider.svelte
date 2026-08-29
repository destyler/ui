<script module lang="ts">
  import { getDocument, getWindow } from '@destyler/dom'
  import type { MaybeFunction } from '@destyler/utils'
  import type { Snippet } from 'svelte'
  import type { RootNode, UseEnvironmentContext } from '../hooks/use-environment-context'

  export interface EnvironmentProviderProps {
    /**
     * The root node to use for the environment.
     */
    value?: MaybeFunction<RootNode>
    /**
     * The children to render.
     */
    children?: Snippet
  }
</script>

<script lang="ts">
  import { runIfFn } from '@destyler/utils'
  import { EnvironmentContextProvider, useEnvironmentContext } from '../hooks/use-environment-context'

  const { value, children }: EnvironmentProviderProps = $props()
  let spanRef: HTMLSpanElement | null = $state(null)
  const parentEnvironment = useEnvironmentContext()

  const getRootNode = () => runIfFn(value) ?? spanRef?.ownerDocument ?? parentEnvironment().getRootNode()

  const environment = $derived<ReturnType<UseEnvironmentContext>>({
    getRootNode,
    getDocument: () => getDocument(getRootNode()),
    getWindow: () => getWindow(getRootNode()),
  })

  EnvironmentContextProvider(() => environment)
</script>

{@render children?.()}
{#if !value}
  <span bind:this={spanRef} hidden></span>
{/if}
