<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface StepsSeparatorBaseProps extends PolymorphicProps<'div'> {}
  export interface StepsSeparatorProps extends Assign<HTMLProps<'div'>, StepsSeparatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useStepsContext } from '../hooks/use-steps-context'
  import { useStepsItemPropsContext } from '../hooks/use-steps-item-props-context'

  const props: StepsSeparatorProps = $props()

  const steps = useStepsContext()
  const itemProps = useStepsItemPropsContext()
  const mergedProps = $derived(mergeProps(steps().getSeparatorProps(itemProps()), props))
</script>

<UI as="div" {...mergedProps} />
