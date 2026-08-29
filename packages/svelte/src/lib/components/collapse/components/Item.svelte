<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ItemProps } from '@destyler/collapse'

  export interface CollapseItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
  export interface CollapseItemProps extends Assign<HTMLProps<'div'>, CollapseItemBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { useRenderStrategyPropsContext } from '$lib/utils/render-strategy'
  import { mergeProps } from '@destyler/svelte'
  import { CollapsibleRoot } from '../../collapsible'
  import { useCollapseContext } from '../hooks/use-collapse-context'
  import { CollapseItemProvider } from '../hooks/use-collapse-item-context'
  import { CollapseItemPropsProvider } from '../hooks/use-collapse-item-props-context'

  const props: CollapseItemProps = $props()
  const [itemProps, localProps] = $derived(createSplitProps<ItemProps>()(props, ['value', 'disabled']))

  const collapse = useCollapseContext()
  const renderStrategy = useRenderStrategyPropsContext()

  const itemState = $derived(collapse().getItemState(itemProps))
  const mergedProps = $derived(mergeProps(collapse().getItemProps(itemProps), localProps))

  const itemContentProps = $derived(collapse().getItemContentProps(itemProps))

  CollapseItemPropsProvider(() => itemProps)
  CollapseItemProvider(() => itemState)
</script>

<CollapsibleRoot
  open={itemState.expanded}
  ids={{ content: itemContentProps.id ?? undefined }}
  {...renderStrategy()}
  {...mergedProps}
/>
