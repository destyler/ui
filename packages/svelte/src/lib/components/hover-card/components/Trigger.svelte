<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface HoverCardTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface HoverCardTriggerProps extends Assign<HTMLProps<'button'>, HoverCardTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useHoverCardContext } from '../hooks/use-hover-card-context'

  const props: HoverCardTriggerProps = $props()

  const hoverCard = useHoverCardContext()
  const mergedProps = $derived(mergeProps(hoverCard().getTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
