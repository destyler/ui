<script lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTimerContext } from '../hooks/use-timer-context'

  export interface TimerControlBaseProps extends PolymorphicProps<'div'> {}
  export interface TimerControlProps extends Assign<HTMLProps<'div'>, TimerControlBaseProps> {}

  const props: TimerControlProps = $props()
  const timer = useTimerContext()
  const mergedProps = $derived(mergeProps(timer().getControlProps(), props))
</script>

<UI as="div" {...mergedProps} />
