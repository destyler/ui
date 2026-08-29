<script lang="ts">
  import { Separator, useSeparator } from '../index'

  const id = $props.id()
  const separator = useSeparator({ id })
</script>

<main style="width: 300px; padding: 1rem;">
  <div>
    <p>Destyler UI</p>
    <p>Unstyled components for Svelte.</p>
  </div>
  <Separator.RootProvider value={separator}>
    <Separator.Root />
  </Separator.RootProvider>
</main>
