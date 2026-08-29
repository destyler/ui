<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseEditContext } from '../hooks/use-edit-context'

  export interface EditContextProps {
    render: Snippet<[UseEditContext]>
  }
</script>

<script lang="ts">
  import { useEditContext } from '../hooks/use-edit-context'

  const { render }: EditContextProps = $props()

  const edit = useEditContext()
</script>

{@render render(edit)}
