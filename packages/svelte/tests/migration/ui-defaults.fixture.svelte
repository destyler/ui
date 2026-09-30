<script lang="ts">
  import type { Entry } from './open-cases'
  import type { UseCalendarProps, UseEditProps } from '$lib'
  import { Calendar, Edit, useCalendar, useEdit } from '$lib'
  import { untrack } from 'svelte'

  let {
    family, entry = 'root', defaultView, view, defaultEdit, edit, unrelated = 0,
    onEditChange, onViewChange, onValueCommit, onValueRevert,
  }: {
    family: 'calendar' | 'edit'
    entry?: Entry
    defaultView?: UseCalendarProps['view']
    view?: UseCalendarProps['view']
    defaultEdit?: boolean
    edit?: boolean
    unrelated?: number
    onEditChange?: UseEditProps['onEditChange']
    onViewChange?: UseCalendarProps['onViewChange']
    onValueCommit?: UseEditProps['onValueCommit']
    onValueRevert?: UseEditProps['onValueRevert']
  } = $props()
  const id = $props.id()
  const calendarProps = $derived({ id, defaultView, view, onViewChange })
  const editProps = $derived({ id, defaultEdit, edit, defaultValue: 'Original', onEditChange, onValueCommit, onValueRevert })
  const calendar = untrack(() => family === 'calendar' && entry !== 'root' ? useCalendar(() => calendarProps) : undefined)
  const editable = untrack(() => family === 'edit' && entry !== 'root' ? useEdit(() => editProps) : undefined)
</script>

{#snippet calendarParts(api: ReturnType<typeof useCalendar>)}
  <output data-testid="api-view">{api().view}</output>
  <button type="button" data-testid="change-view" onclick={() => api().setView('month')}>Month</button>
  <div hidden={api().view !== 'day'} data-testid="day-view">Day view</div>
  <div hidden={api().view !== 'month'} data-testid="month-view">Month view</div>
  <div hidden={api().view !== 'year'} data-testid="year-view">Year view</div>
{/snippet}

{#snippet editParts(api: ReturnType<typeof useEdit>)}
  <output data-testid="api-editing">{String(api().editing)}</output>
  <button type="button" {...api().getEditTriggerProps()} data-testid="request-edit" onclick={() => api().edit()}>Edit</button>
  <button type="button" {...api().getSubmitTriggerProps()} data-testid="request-submit" onclick={() => api().submit()}>Submit</button>
  <button type="button" {...api().getCancelTriggerProps()} data-testid="request-cancel" onclick={() => api().cancel()}>Cancel</button>
  <input {...api().getInputProps()} data-testid="edit-input" />
  <span {...api().getPreviewProps()} data-testid="edit-preview">{api().value}</span>
{/snippet}

<div data-unrelated={unrelated}>
  {#if family === 'calendar'}
    {#if entry === 'root'}
      <Calendar.Root {...calendarProps}>
        <Calendar.Context>
          {#snippet render(api)}
            {@render calendarParts(api)}
          {/snippet}
        </Calendar.Context>
        <Calendar.View view="day" data-testid="component-day-view">Day</Calendar.View>
        <Calendar.View view="month" data-testid="component-month-view">Month</Calendar.View>
        <Calendar.View view="year" data-testid="component-year-view">Year</Calendar.View>
      </Calendar.Root>
    {:else if entry === 'provider' && calendar}
      <Calendar.RootProvider value={calendar}>
        <Calendar.Context>
          {#snippet render(api)}
            {@render calendarParts(api)}
          {/snippet}
        </Calendar.Context>
        <Calendar.View view="day" data-testid="component-day-view">Day</Calendar.View>
        <Calendar.View view="month" data-testid="component-month-view">Month</Calendar.View>
        <Calendar.View view="year" data-testid="component-year-view">Year</Calendar.View>
      </Calendar.RootProvider>
    {:else if calendar}
      {@render calendarParts(calendar)}
    {/if}
  {:else if entry === 'root'}
    <Edit.Root {...editProps}>
      <Edit.Context>
        {#snippet render(api)}
          {@render editParts(api)}
        {/snippet}
      </Edit.Context>
    </Edit.Root>
  {:else if entry === 'provider' && editable}
    <Edit.RootProvider value={editable}>
      <Edit.Context>
        {#snippet render(api)}
          {@render editParts(api)}
        {/snippet}
      </Edit.Context>
    </Edit.RootProvider>
  {:else if editable}
    {@render editParts(editable)}
  {/if}
</div>
