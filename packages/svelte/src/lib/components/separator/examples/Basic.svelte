<script lang="ts">
  import type { SeparatorRootProps } from '../index'
  import { Separator } from '../index'

  const props: SeparatorRootProps = $props()
</script>

<main style="width: 300px; padding: 1rem;">
  <div>
    <p>Destyler UI</p>
    <p>Unstyled components for Svelte.</p>
  </div>
  <Separator.Root {...props} />
  <nav style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">
    <span>Blog</span>
    <Separator.Root orientation="vertical" style="height: 1rem;" />
    <span>Docs</span>
    <Separator.Root orientation="vertical" style="height: 1rem;" />
    <span>Source</span>
  </nav>
</main>
