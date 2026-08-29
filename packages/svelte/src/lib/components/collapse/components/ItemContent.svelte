<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface CollapseItemContentBaseProps extends PolymorphicProps<'div'> {}
  export interface CollapseItemContentProps extends Assign<HTMLProps<'div'>, CollapseItemContentBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { omit } from '@destyler/utils'
  import { CollapsibleContent } from '../../collapsible'
  import { useCollapseContext } from '../hooks/use-collapse-context'
  import { useCollapseItemPropsContext } from '../hooks/use-collapse-item-props-context'

  const props: CollapseItemContentProps = $props()

  const collapse = useCollapseContext()
  const itemProps = useCollapseItemPropsContext()

  const contentProps = $derived(collapse().getItemContentProps(itemProps()))
  const itemContentProps = $derived(omit(contentProps, ['hidden', 'data-state']))

  const mergedProps = $derived(mergeProps(itemContentProps, props))
</script>

<CollapsibleContent {...mergedProps} />
