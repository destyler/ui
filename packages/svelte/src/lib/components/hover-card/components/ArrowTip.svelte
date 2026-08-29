<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface HoverCardArrowTipBaseProps extends PolymorphicProps<'div'> {}
  export interface HoverCardArrowTipProps extends Assign<HTMLProps<'div'>, HoverCardArrowTipBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useHoverCardContext } from '../hooks/use-hover-card-context'

  const props: HoverCardArrowTipProps = $props()

  const hoverCard = useHoverCardContext()
  const mergedProps = $derived(mergeProps(hoverCard().getArrowTipProps(), props))
</script>

<UI as="div" {...mergedProps} />
