<script module lang="ts">
  import type { Snippet } from 'svelte'

  export interface PortalTargetProps {
    container: HTMLElement
    children: Snippet
  }
</script>

<script lang="ts">
  import { getAllContexts, mount, unmount } from 'svelte'
  import PortalContent from './PortalContent.svelte'

  const { container, children }: PortalTargetProps = $props()
  const context = getAllContexts()

  $effect(() => {
    const instance = mount(PortalContent, {
      target: container,
      props: { children },
      context,
    })

    return () => void unmount(instance)
  })
</script>
