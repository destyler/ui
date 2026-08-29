<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface AvatarImageBaseProps extends PolymorphicProps<'img'> {}
  export interface AvatarImageProps extends Assign<HTMLProps<'img'>, AvatarImageBaseProps> {}
</script>

<script lang="ts">
  import { UI } from '../../factory'
  import { mergeProps } from '@destyler/svelte'
  import { useAvatarContext } from '../hooks/use-avatar-context'

  const props: AvatarImageProps = $props()
  const avatar = useAvatarContext()
  const mergedProps = $derived(mergeProps(avatar().getImageProps(), props))
</script>

<UI as="img" {...mergedProps} />
