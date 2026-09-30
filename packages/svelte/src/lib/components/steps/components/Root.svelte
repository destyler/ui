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

  // Read the parent prop independently from the writable binding. Local writes
  // notify bind: consumers without overriding ordinary controlled props.
  let {
    step = $bindable(),
    step: stepProp,
    ...props
  }: StepsRootProps = $props()
  const providedId = $props.id()

  const [useStepsProps, localProps] = $derived(splitStepsProps(props))

  const resolvedProps = $derived<UseStepsProps>({
    ...useStepsProps,
    id: useStepsProps.id ?? providedId,
    step: stepProp,
    onStepChange(details) {
      useStepsProps.onStepChange?.(details)
      step = details.step
    },
  })

  const stepsApi = useSteps(() => resolvedProps)
  const mergedProps = $derived(mergeProps(stepsApi().getRootProps(), localProps))

  StepsProvider(stepsApi)
</script>

<UI as="div" {...mergedProps} />
