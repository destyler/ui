<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface CollapseItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
  export interface CollapseItemIndicatorProps extends Assign<HTMLProps<'div'>, CollapseItemIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useCollapseContext } from '../hooks/use-collapse-context'
  import { useCollapseItemPropsContext } from '../hooks/use-collapse-item-props-context'

  const props: CollapseItemIndicatorProps = $props()

  const collapse = useCollapseContext()
  const itemProps = useCollapseItemPropsContext()

  const mergedProps = $derived(mergeProps(collapse().getItemIndicatorProps(itemProps()), props))
</script>

<UI as="div" {...mergedProps} />
