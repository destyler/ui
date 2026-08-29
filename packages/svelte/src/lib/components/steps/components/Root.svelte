<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseStepsProps } from '../hooks/use-steps.svelte'

  export interface StepsRootBaseProps extends Optional<UseStepsProps, 'id'>, PolymorphicProps<'div'> {}
  export interface StepsRootProps extends Assign<HTMLProps<'div'>, StepsRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { splitStepsProps } from '../hooks/split-steps-props.svelte'
  import { useSteps } from '../hooks/use-steps.svelte'
  import { StepsProvider } from '../hooks/use-steps-context'

  let { step = $bindable(), ...props }: StepsRootProps = $props()
  const providedId = $props.id()

  const [useStepsProps, localProps] = $derived(splitStepsProps(props))

  const resolvedProps = $derived<UseStepsProps>({
    ...useStepsProps,
    id: useStepsProps.id ?? providedId,
    step,
    onStepChange(details) {
      useStepsProps.onStepChange?.(details)
      if (step !== undefined) step = details.step
    },
  })

  const stepsApi = useSteps(() => resolvedProps)
  const mergedProps = $derived(mergeProps(stepsApi().getRootProps(), localProps))

  StepsProvider(stepsApi)
</script>

<UI as="div" {...mergedProps} />
