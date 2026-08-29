<script lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTimerContext } from '../hooks/use-timer-context'

  export interface TimerSeparatorBaseProps extends PolymorphicProps<'div'> {}
  export interface TimerSeparatorProps extends Assign<HTMLProps<'div'>, TimerSeparatorBaseProps> {}

  const props: TimerSeparatorProps = $props()
  const timer = useTimerContext()
  const mergedProps = $derived(mergeProps(timer().getSeparatorProps(), props))
</script>

<UI as="div" {...mergedProps} />
