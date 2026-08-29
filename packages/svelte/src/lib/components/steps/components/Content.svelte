<script module lang="ts">
  import type { ItemProps } from '@destyler/steps'
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface StepsContentBaseProps extends ItemProps, PolymorphicProps<'div'> {}
  export interface StepsContentProps extends Assign<HTMLProps<'div'>, StepsContentBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useStepsContext } from '../hooks/use-steps-context'

  const props: StepsContentProps = $props()
  const [itemProps, localProps] = $derived(createSplitProps<ItemProps>()(props, ['index']))

  const steps = useStepsContext()
  const mergedProps = $derived(mergeProps(steps().getContentProps(itemProps), localProps))
</script>

<UI as="div" {...mergedProps} />
