<script lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { TimerProvider } from '../hooks/use-timer-context'
  import type { UseTimerReturn } from '../hooks/use-timer.svelte'

  interface RootProviderProps {
    value: UseTimerReturn
  }

  export interface TimerRootProviderBaseProps extends RootProviderProps, PolymorphicProps<'div'> {}
  export interface TimerRootProviderProps extends Assign<HTMLProps<'div'>, TimerRootProviderBaseProps> {}

  const { value: timer, ...localProps }: TimerRootProviderProps = $props()
  const mergedProps = $derived(mergeProps(timer().getRootProps(), localProps))

  TimerProvider(() => timer())
</script>

<UI as="div" {...mergedProps} />
