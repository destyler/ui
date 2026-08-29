<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface AvatarFallbackBaseProps extends PolymorphicProps<'span'> {}
  export interface AvatarFallbackProps extends Assign<HTMLProps<'span'>, AvatarFallbackBaseProps> {}
</script>

<script lang="ts">
  import { useAvatarContext } from '../hooks/use-avatar-context'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'

  const props: AvatarFallbackProps = $props()

  const avatar = useAvatarContext()
  const mergedProps = $derived(mergeProps(avatar().getFallbackProps(), props))
</script>

<UI as="span" {...mergedProps} />
