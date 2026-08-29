<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface StepsNextTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface StepsNextTriggerProps extends Assign<HTMLProps<'button'>, StepsNextTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useStepsContext } from '../hooks/use-steps-context'

  const props: StepsNextTriggerProps = $props()

  const steps = useStepsContext()
  const mergedProps = $derived(mergeProps(steps().getNextTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
