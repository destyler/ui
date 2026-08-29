<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface StepsProgressBaseProps extends PolymorphicProps<'div'> {}
  export interface StepsProgressProps extends Assign<HTMLProps<'div'>, StepsProgressBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useStepsContext } from '../hooks/use-steps-context'

  const props: StepsProgressProps = $props()

  const steps = useStepsContext()
  const mergedProps = $derived(mergeProps(steps().getProgressProps(), props))
</script>

<UI as="div" {...mergedProps} />
