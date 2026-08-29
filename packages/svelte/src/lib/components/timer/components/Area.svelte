<script lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTimerContext } from '../hooks/use-timer-context'

  export interface TimerAreaBaseProps extends PolymorphicProps<'div'> {}
  export interface TimerAreaProps extends Assign<HTMLProps<'div'>, TimerAreaBaseProps> {}

  const props: TimerAreaProps = $props()
  const timer = useTimerContext()
  const mergedProps = $derived(mergeProps(timer().getAreaProps(), props))
</script>

<UI as="div" {...mergedProps} />
