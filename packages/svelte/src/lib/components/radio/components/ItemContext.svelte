<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseRadioItemContext } from '../hooks/use-radio-item-context'

  export interface RadioItemContextProps {
    render: Snippet<[UseRadioItemContext]>
  }
</script>

<script lang="ts">
  import { useRadioItemContext } from '../hooks/use-radio-item-context'

  let { render }: RadioItemContextProps = $props()

  const context = useRadioItemContext()
</script>

{@render render(context)}
