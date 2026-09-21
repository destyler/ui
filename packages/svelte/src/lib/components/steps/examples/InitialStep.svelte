<script lang="ts">
  import type { StepsRootProps } from '../index'
  import { Steps } from '../index'

  const props: StepsRootProps = $props()
  const items = [
    { value: 'first', title: 'First', description: 'Contact Info' },
    { value: 'second', title: 'Second', description: 'Date & Time' },
    { value: 'third', title: 'Third', description: 'Select Rooms' },
  ]
</script>

<Steps.Root count={items.length} {...props} defaultStep={1}>
