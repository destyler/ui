<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types.js'
  import type { UseCalendarProps } from '../hooks/use-calendar.svelte.js'
  import type { UsePresenceProps } from '../../presence/index.js'

  export interface CalendarRootBaseProps
    extends Optional<UseCalendarProps, 'id'>,
      UsePresenceProps,
      PolymorphicProps<'div'> {}
  export interface CalendarRootProps extends Assign<HTMLProps<'div'>, CalendarRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props.js'
  import { UI } from '../../factory/index.js'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence/index.js'
  import { useCalendar } from '../hooks/use-calendar.svelte.js'
  import { CalendarProvider } from '../hooks/use-calendar-context.js'

  // Read the parent prop independently from the writable binding. Local writes
  // notify bind: consumers without overriding ordinary controlled props.
  let {
    value = $bindable(),
    value: valueProp,
    focusedValue = $bindable(),
    focusedValue: focusedValueProp,
    open = $bindable(),
    open: openProp,
    view = $bindable(),
    view: viewProp,
    ...props
  }: CalendarRootProps = $props()
  const providedId = $props.id()

  const [presenceProps, calendarProps] = $derived(splitPresenceProps(props))
  const [useCalendarProps, localProps] = $derived(
    createSplitProps<Optional<UseCalendarProps, 'id'>>()(calendarProps, [
      'closeOnSelect',
      'defaultOpen',
      'defaultValue',
      'defaultView',
      'disabled',
      'fixedWeeks',
      'focusedValue',
      'format',
      'id',
      'ids',
      'isDateUnavailable',
      'locale',
      'max',
      'maxView',
      'min',
      'minView',
      'name',
      'numOfMonths',
      'onFocusChange',
      'onOpenChange',
      'onValueChange',
      'onViewChange',
      'open',
      'parse',
      'placeholder',
      'positioning',
      'readOnly',
      'selectionMode',
      'startOfWeek',
      'timeZone',
      'translations',
      'value',
      'view',
    ]),
  )

  const resolvedProps = $derived<UseCalendarProps>({
    ...useCalendarProps,
    id: useCalendarProps.id ?? providedId,
    value: valueProp,
    onValueChange(details) {
      useCalendarProps.onValueChange?.(details)
      value = details.value
    },
    focusedValue: focusedValueProp,
    onFocusChange(details) {
      useCalendarProps.onFocusChange?.(details)
      focusedValue = details.focusedValue
    },
    open: openProp,
    onOpenChange(details) {
      useCalendarProps.onOpenChange?.(details)
      open = details.open
    },
    view: viewProp,
    onViewChange(details) {
      useCalendarProps.onViewChange?.(details)
      view = details.view
    },
  })

  const calendar = useCalendar(() => resolvedProps)
  const presence = usePresence(() => mergeProps({ present: calendar().open }, presenceProps))
  const mergedProps = $derived(mergeProps(calendar().getRootProps(), localProps))

  CalendarProvider(() => calendar())
  PresenceProvider(() => presence())
</script>

<UI as="div" {...mergedProps} />
