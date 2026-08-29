<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseRadioContext } from '../hooks/use-radio-context'

  export interface RadioContextProps {
    children: Snippet<[UseRadioContext]>
  }
</script>

<script lang="ts">
  import { useRadioContext } from '../hooks/use-radio-context'

  let { children }: RadioContextProps = $props()

  const context = useRadioContext()
</script>

{@render children(context)}
