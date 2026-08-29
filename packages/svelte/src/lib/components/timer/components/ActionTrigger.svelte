<script lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import { mergeProps } from '@destyler/svelte'
  import type { ActionTriggerProps } from '@destyler/timer'
  import { UI } from '../../factory'
  import { useTimerContext } from '../hooks/use-timer-context'

  export interface TimerActionTriggerBaseProps extends ActionTriggerProps, PolymorphicProps<'button'> {}

  export interface TimerActionTriggerProps extends Assign<HTMLProps<'button'>, TimerActionTriggerBaseProps> {}

  const props: TimerActionTriggerProps = $props()

  const timer = useTimerContext()
  const mergedProps = $derived(mergeProps(timer().getActionTriggerProps(props), props))
</script>

<UI as="button" {...mergedProps} />
