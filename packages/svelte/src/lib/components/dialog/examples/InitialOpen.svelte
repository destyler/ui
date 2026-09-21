<script lang="ts">
  import type { DialogRootProps } from '../index'
  import { portal } from '$lib'
  import { Dialog } from '../index'

  const props: DialogRootProps = $props()
</script>

<Dialog.Root {...props} defaultOpen>
