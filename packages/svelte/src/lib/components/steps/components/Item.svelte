<script module lang="ts">
  import type { ItemProps } from '@destyler/steps'
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface StepsItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
  export interface StepsItemProps extends Assign<HTMLProps<'div'>, StepsItemBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useStepsContext } from '../hooks/use-steps-context'
  import { StepsItemProvider } from '../hooks/use-steps-item-context'
  import { StepsItemPropsProvider } from '../hooks/use-steps-item-props-context'

  const props: StepsItemProps = $props()
  const [itemProps, localProps] = $derived(createSplitProps<ItemProps>()(props, ['index']))

  const steps = useStepsContext()
  const itemState = $derived(steps().getItemState(itemProps))
  const mergedProps = $derived(mergeProps(steps().getItemProps(itemProps), localProps))

  StepsItemPropsProvider(() => itemProps)
  StepsItemProvider(() => itemState)
</script>

<UI as="div" {...mergedProps} />
