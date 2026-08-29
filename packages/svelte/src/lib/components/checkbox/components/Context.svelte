<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseCheckboxContext } from '../hooks/use-checkbox-context'

  export interface CheckboxContextProps {
    render?: Snippet<[UseCheckboxContext]>
  }
</script>

<script lang="ts">
  import { useCheckboxContext } from '../hooks/use-checkbox-context'

  const { render }: CheckboxContextProps = $props()

  const context = useCheckboxContext()
</script>

{@render render?.(context)}
