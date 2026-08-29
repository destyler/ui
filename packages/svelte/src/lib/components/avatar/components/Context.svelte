<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseAvatarContext } from '../hooks/use-avatar-context'

  export interface AvatarContextProps {
    api?: Snippet<[UseAvatarContext]>
  }
</script>

<script lang="ts">
  import { useAvatarContext } from '../hooks/use-avatar-context'

  const { api }: AvatarContextProps = $props()
  const avatar = useAvatarContext()
</script>

{@render api?.(avatar)}
