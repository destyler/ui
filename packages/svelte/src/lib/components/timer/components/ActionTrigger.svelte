<script lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import type { ActionTriggerProps } from '@destyler/timer'
  import { UI } from '../../factory'
  import { useTimerContext } from '../hooks/use-timer-context'

  export interface TimerActionTriggerBaseProps extends ActionTriggerProps, PolymorphicProps<'button'> {}

  export interface TimerActionTriggerProps extends Assign<HTMLProps<'button'>, TimerActionTriggerBaseProps> {}

  const props: TimerActionTriggerProps = $props()

  const [actionTriggerProps, localProps] = $derived(
    createSplitProps<ActionTriggerProps>()(props, ['action']),
  )

  const timer = useTimerContext()
  const mergedProps = $derived(mergeProps(timer().getActionTriggerProps(actionTriggerProps), localProps))
</script>

<UI as="button" {...mergedProps} />
