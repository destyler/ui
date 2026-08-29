<script lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { TimerProvider } from '../hooks/use-timer-context'
  import type { UseTimerProps } from '../hooks/use-timer.svelte'
  import { useTimer } from '../hooks/use-timer.svelte'

  export interface TimerRootBaseProps extends Optional<UseTimerProps, 'id'>, PolymorphicProps<'div'> {}
  export interface TimerRootProps extends Assign<HTMLProps<'div'>, TimerRootBaseProps> {}

  const props: TimerRootProps = $props()
  const providedId = $props.id()

  const [useTimerProps, localProps] = $derived(
    createSplitProps<Optional<UseTimerProps, 'id'>>()(props, [
      'id',
      'ids',
      'autoStart',
      'interval',
      'countdown',
      'startMs',
      'targetMs',
      'onComplete',
      'onTick',
    ]),
  )

  const resolvedProps = $derived({
    ...useTimerProps,
    id: useTimerProps.id ?? providedId,
  })

  const timer = useTimer(() => resolvedProps)
  const mergedProps = $derived(mergeProps(timer().getRootProps(), localProps))

  TimerProvider(() => timer())
</script>

<UI as="div" {...mergedProps} />
