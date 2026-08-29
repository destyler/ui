<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseAvatarProps } from '../hooks/use-avatar.svelte'

  export interface AvatarRootBaseProps extends Optional<UseAvatarProps, 'id'>, PolymorphicProps<'div'> {}
  export interface AvatarRootProps extends Assign<HTMLProps<'div'>, AvatarRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props'
  import { UI } from '../../factory'
  import { AvatarProvider } from '../hooks/use-avatar-context'
  import { useAvatar } from '../hooks/use-avatar.svelte'

  const props: AvatarRootProps = $props()
  const providedId = $props.id()

  const [useAvatarProps, localProps] = $derived(
    createSplitProps<Optional<UseAvatarProps, 'id'>>()(props, ['id', 'ids', 'onStatusChange']),
  )

  const resolvedProps = $derived({
    ...useAvatarProps,
    id: useAvatarProps.id ?? providedId,
  })

  const avatar = useAvatar(() => resolvedProps)
  const mergedProps = $derived(mergeProps(avatar().getRootProps(), localProps))

  AvatarProvider(() => avatar())
</script>

<UI as="div" {...mergedProps} />
