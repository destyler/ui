<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseDialogContext } from '../hooks/use-dialog-context'

  export interface DialogContextProps {
    children: Snippet<[UseDialogContext]>
  }
</script>

<script lang="ts">
  import { useDialogContext } from '../hooks/use-dialog-context'

  const { children }: DialogContextProps = $props()

  const dialog = useDialogContext()
</script>

{@render children(dialog)}
