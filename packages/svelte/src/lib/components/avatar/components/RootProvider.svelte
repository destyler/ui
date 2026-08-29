<script module lang="ts">
  import type { Assign, HTMLProps } from '$lib/types'
  import type { UseAvatarReturn } from '../hooks/use-avatar.svelte'

  interface RootProviderProps {
    value: UseAvatarReturn
  }

  export interface AvatarRootProviderBaseProps extends RootProviderProps {}
  export interface AvatarRootProviderProps extends Assign<HTMLProps<'div'>, AvatarRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { AvatarProvider } from '../hooks/use-avatar-context'

  const { value: avatar, ...localProps }: AvatarRootProviderProps = $props()
  const mergedProps = $derived(mergeProps(avatar().getRootProps(), localProps))

  AvatarProvider(() => avatar())
</script>

<UI as="div" {...mergedProps} />
