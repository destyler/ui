<script lang="ts">
  import { Label, useLabel } from '../index'

  const id = $props.id()
  const label = useLabel({ id })
</script>

<main>
  <Label.RootProvider value={label}>Email Address</Label.RootProvider>
</main>
