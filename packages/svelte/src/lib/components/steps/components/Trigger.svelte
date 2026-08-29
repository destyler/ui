<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface StepsTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface StepsTriggerProps extends Assign<HTMLProps<'button'>, StepsTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useStepsContext } from '../hooks/use-steps-context'
  import { useStepsItemPropsContext } from '../hooks/use-steps-item-props-context'

  const props: StepsTriggerProps = $props()

  const steps = useStepsContext()
  const itemProps = useStepsItemPropsContext()
  const mergedProps = $derived(mergeProps(steps().getTriggerProps(itemProps()), props))
</script>

<UI as="button" {...mergedProps} />
