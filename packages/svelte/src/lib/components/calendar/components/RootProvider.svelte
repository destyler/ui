<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'
  import type { UsePresenceProps } from '../../presence/index.js'
  import type { UseCalendarReturn } from '../hooks/use-calendar.svelte.js'

  interface RootProviderProps {
    value: UseCalendarReturn
  }

  export interface CalendarRootProviderBaseProps
    extends RootProviderProps,
      UsePresenceProps,
      PolymorphicProps<'div'> {}
  export interface CalendarRootProviderProps extends Assign<HTMLProps<'div'>, CalendarRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence/index.js'
  import { CalendarProvider } from '../hooks/use-calendar-context.js'

  const { value, ...props }: CalendarRootProviderProps = $props()

  const [presenceProps, localProps] = $derived(splitPresenceProps(props))

  const presence = usePresence(() => mergeProps({ present: value().open }, presenceProps))
  const mergedProps = $derived(mergeProps(value().getRootProps(), localProps))

  CalendarProvider(() => value())
  PresenceProvider(() => presence())
</script>

<UI as="div" {...mergedProps} />
