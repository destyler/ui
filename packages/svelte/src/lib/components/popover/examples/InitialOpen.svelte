<script lang="ts">
  import type { PopoverRootProps } from '../index'
  import { Popover } from '../index'

  const props: PopoverRootProps = $props()
</script>

<Popover.Root {...props} defaultOpen>
