<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface StepsPrevTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface StepsPrevTriggerProps extends Assign<HTMLProps<'button'>, StepsPrevTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useStepsContext } from '../hooks/use-steps-context'

  const props: StepsPrevTriggerProps = $props()

  const steps = useStepsContext()
  const mergedProps = $derived(mergeProps(steps().getPrevTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
