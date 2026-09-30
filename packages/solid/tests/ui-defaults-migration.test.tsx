import type { UseCheckboxReturn } from '../src/components/checkbox'
import type { UseEditReturn } from '../src/components/edit'
import { cleanup, fireEvent, render, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Calendar, useCalendar } from '../src/components/calendar'
import { Checkbox, useCheckbox } from '../src/components/checkbox'
import { Edit, useEdit } from '../src/components/edit'

afterEach(cleanup)

describe('undefined live ownership at the public hook and RootProvider boundary', () => {
  it('keeps API, input and control in sync across repeated toggles', async () => {
    let api!: UseCheckboxReturn
    const onCheckedChange = vi.fn()
    const view = render(() => {
      api = useCheckbox({ checked: undefined, defaultChecked: true, onCheckedChange })
      return (
        <Checkbox.RootProvider value={api}>
          <Checkbox.Label>Provider checkbox</Checkbox.Label>
          <Checkbox.Control data-testid="control" />
          <Checkbox.HiddenInput />
        </Checkbox.RootProvider>
      )
    })
    const input = view.getByRole('checkbox')
    const control = view.getByTestId('control')
    expect(api().checked).toBe(true)
    expect(input).toBeChecked()
    expect(control).toHaveAttribute('data-state', 'checked')
    await user.click(input)
    expect(api().checked).toBe(false)
    expect(input).not.toBeChecked()
    expect(control).toHaveAttribute('data-state', 'unchecked')
    expect(onCheckedChange).toHaveBeenLastCalledWith({ checked: false })
    await user.click(input)
    expect(api().checked).toBe(true)
    expect(input).toBeChecked()
    expect(control).toHaveAttribute('data-state', 'checked')
    expect(onCheckedChange).toHaveBeenLastCalledWith({ checked: true })
  })

  it('requests a controlled change and only updates after parent writeback', async () => {
    const [checked, setChecked] = createSignal(false)
    const onCheckedChange = vi.fn()
    let api!: UseCheckboxReturn
    const view = render(() => {
      api = useCheckbox({ get checked() {
        return checked()
      }, defaultChecked: true, onCheckedChange })
      return (
        <Checkbox.RootProvider value={api}>
          <Checkbox.Control data-testid="control" />
          <Checkbox.HiddenInput />
        </Checkbox.RootProvider>
      )
    })
    api().setChecked(true)
    expect(onCheckedChange).toHaveBeenLastCalledWith({ checked: true })
    expect(api().checked).toBe(false)
    expect(view.getByRole('checkbox')).not.toBeChecked()
    expect(view.getByTestId('control')).toHaveAttribute('data-state', 'unchecked')
    setChecked(true)
    await waitFor(() => expect(api().checked).toBe(true))
    expect(view.getByRole('checkbox')).toBeChecked()
    expect(view.getByTestId('control')).toHaveAttribute('data-state', 'checked')
  })
})

describe('initial-only UI state adapters', () => {
  it.each(['Root', 'RootProvider'] as const)('calendar %s seeds the view once', async (entry) => {
    const [defaultView, setDefaultView] = createSignal<'year' | 'month'>('year')
    const [disabled, setDisabled] = createSignal(false)
    const props = { get defaultView() {
      return defaultView()
    }, get disabled() {
      return disabled()
    } }
    const content = () => (
      <Calendar.Context>
        {api => (
          <>
            <output data-testid="view">{api().view}</output>
            <button onClick={() => api().setView('month')}>Change view</button>
          </>
        )}
      </Calendar.Context>
    )
    const view = render(() => {
      if (entry === 'Root')
        return <Calendar.Root {...props}>{content()}</Calendar.Root>
      const api = useCalendar(props)
      return <Calendar.RootProvider value={api}>{content()}</Calendar.RootProvider>
    })
    expect(view.getByTestId('view')).toHaveTextContent('year')
    fireEvent.click(view.getByRole('button'))
    await waitFor(() => expect(view.getByTestId('view')).toHaveTextContent('month'))
    setDefaultView('month')
    setDefaultView('year')
    setDisabled(true)
    expect(view.getByTestId('view')).toHaveTextContent('month')
  })

  it.each(['Root', 'RootProvider'] as const)('edit %s leaves default editing on submit and cancel without reseeding', async (entry) => {
    const [defaultEdit, setDefaultEdit] = createSignal(true)
    const [placeholder, setPlaceholder] = createSignal('first')
    const onEditChange = vi.fn()
    const onValueCommit = vi.fn()
    const onValueRevert = vi.fn()
    const props = {
      get defaultEdit() { return defaultEdit() },
      get placeholder() { return placeholder() },
      edit: undefined,
      value: undefined,
      defaultValue: 'Seed',
      onEditChange,
      onValueCommit,
      onValueRevert,
    }
    let api!: UseEditReturn
    const content = () => (
      <>
        <Edit.Context>{(context) => {
          api = context
          return <output data-testid="editing">{String(context().editing)}</output>
        }}
        </Edit.Context>
        <Edit.Input />
        <Edit.Preview />
        <Edit.EditTrigger>Edit</Edit.EditTrigger>
        <Edit.SubmitTrigger>Save</Edit.SubmitTrigger>
        <Edit.CancelTrigger>Cancel</Edit.CancelTrigger>
      </>
    )
    const view = render(() => {
      if (entry === 'Root')
        return <Edit.Root {...props}>{content()}</Edit.Root>
      const edit = useEdit(props)
      return <Edit.RootProvider value={edit}>{content()}</Edit.RootProvider>
    })
    expect(api().editing).toBe(true)
    expect(view.getByRole('textbox')).toHaveValue('Seed')
    fireEvent.input(view.getByRole('textbox'), { target: { value: 'Saved' } })
    await user.click(view.getByText('Save'))
    await waitFor(() => expect(api().editing).toBe(false))
    expect(api().value).toBe('Saved')
    expect(onValueCommit).toHaveBeenLastCalledWith({ value: 'Saved' })
    expect(onEditChange).toHaveBeenLastCalledWith({ edit: false })
    setDefaultEdit(false)
    setDefaultEdit(true)
    setPlaceholder('unrelated rerender')
    expect(api().editing).toBe(false)
    expect(view.getByText('Saved')).toBeVisible()
    await user.click(view.getByText('Edit'))
    await waitFor(() => expect(api().editing).toBe(true))
    fireEvent.input(view.getByRole('textbox'), { target: { value: 'Discarded' } })
    await user.click(view.getByText('Cancel'))
    await waitFor(() => expect(api().editing).toBe(false))
    expect(api().value).toBe('Saved')
    expect(onValueRevert).toHaveBeenLastCalledWith({ value: 'Saved' })
  })

  it('explicit edit vetoes a request until the parent writes it back', async () => {
    const [edit, setEdit] = createSignal(false)
    const onEditChange = vi.fn()
    let api!: UseEditReturn
    const view = render(() => (
      <Edit.Root edit={edit()} defaultEdit onEditChange={onEditChange}>
        <Edit.Context>{(context) => {
          api = context
          return null
        }}
        </Edit.Context>
        <Edit.Input />
        <Edit.Preview />
        <Edit.EditTrigger>Edit</Edit.EditTrigger>
        <Edit.SubmitTrigger>Save</Edit.SubmitTrigger>
      </Edit.Root>
    ))
    expect(api().editing).toBe(false)
    await user.click(view.getByText('Edit'))
    expect(onEditChange).toHaveBeenLastCalledWith({ edit: true })
    expect(api().editing).toBe(false)
    setEdit(true)
    await waitFor(() => expect(api().editing).toBe(true))
    expect(view.getByRole('textbox')).toBeVisible()
    await user.click(view.getByText('Save'))
    expect(onEditChange).toHaveBeenLastCalledWith({ edit: false })
    expect(api().editing).toBe(true)
    setEdit(false)
    await waitFor(() => expect(api().editing).toBe(false))
  })
})
