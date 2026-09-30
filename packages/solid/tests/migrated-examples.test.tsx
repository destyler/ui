import { cleanup, fireEvent, render, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { Indeterminate } from '../src/components/checkbox/examples/Indeterminate'
import { Collapsible } from '../src/components/collapse/examples/Collapsible'
import { Multiple } from '../src/components/collapse/examples/Multiple'
import { CustomControls } from '../src/components/edit/examples/CustomControls'
import { FractionDigits } from '../src/components/number-input/examples/FractionDigits'
import { Range } from '../src/components/slider/examples/Range'
import { ThumbOverlap } from '../src/components/slider/examples/thumb-overlap'
import { RootProvider } from '../src/components/splitter/examples/RootProvider'
import { DisabledTab } from '../src/components/tabs/examples/DisabledTab'
import { Manual } from '../src/components/tabs/examples/Manual'
import { Vertical } from '../src/components/tabs/examples/Vertical'

afterEach(cleanup)

describe('migrated uncontrolled examples', () => {
  it('checkbox Indeterminate resolves to checked and then unchecked', async () => {
    const view = render(() => <Indeterminate />)
    const input = view.getByRole('checkbox')
    const control = view.container.querySelector('[data-part="control"]')!
    expect(control).toHaveAttribute('data-state', 'indeterminate')
    expect(input).not.toBeChecked()
    await user.click(input)
    expect(control).toHaveAttribute('data-state', 'checked')
    expect(input).toBeChecked()
    expect((input as HTMLInputElement).indeterminate).toBe(false)
    await user.click(input)
    expect(control).toHaveAttribute('data-state', 'unchecked')
    expect(input).not.toBeChecked()
  })

  it('numberInput FractionDigits increments its initial value', async () => {
    const view = render(() => <FractionDigits />)
    const input = view.getByRole('spinbutton')
    expect(input).toHaveValue('1.00')
    const increment = view.container.querySelector<HTMLElement>('[data-part="increment-trigger"]')!
    await user.click(increment)
    await waitFor(() => expect(input).toHaveValue('2.00'))
    await user.click(increment)
    await waitFor(() => expect(input).toHaveValue('3.00'))
  })

  it.each([['Vertical', Vertical], ['DisabledTab', DisabledTab], ['Manual', Manual]] as const)(
    'tabs %s switches away from its seed and back',
    async (_, Example) => {
      const view = render(() => <Example />)
      const solid = view.getByRole('tab', { name: 'Solid' })
      const react = view.getByRole('tab', { name: 'React' })
      expect(react).toHaveAttribute('aria-selected', 'true')
      await user.click(solid)
      await waitFor(() => expect(solid).toHaveAttribute('aria-selected', 'true'))
      expect(react).toHaveAttribute('aria-selected', 'false')
      await user.click(react)
      await waitFor(() => expect(react).toHaveAttribute('aria-selected', 'true'))
    },
  )

  it('collapse Multiple opens another item while preserving the seed', async () => {
    const view = render(() => <Multiple />)
    const react = view.getByRole('button', { name: 'What is React?' })
    const solid = view.getByRole('button', { name: 'What is Solid?' })
    expect(react).toHaveAttribute('aria-expanded', 'true')
    await user.click(solid)
    await waitFor(() => expect(solid).toHaveAttribute('aria-expanded', 'true'))
    expect(react).toHaveAttribute('aria-expanded', 'true')
    await user.click(solid)
    await waitFor(() => expect(solid).toHaveAttribute('aria-expanded', 'false'))
  })

  it('collapse Collapsible closes and reopens the seeded item', async () => {
    const view = render(() => <Collapsible />)
    const react = view.getByRole('button', { name: 'What is React?' })
    expect(react).toHaveAttribute('aria-expanded', 'true')
    await user.click(react)
    await waitFor(() => expect(react).toHaveAttribute('aria-expanded', 'false'))
    await user.click(react)
    await waitFor(() => expect(react).toHaveAttribute('aria-expanded', 'true'))
  })

  it.each([['Range', Range], ['ThumbOverlap', ThumbOverlap]] as const)(
    'slider %s responds to repeated keyboard changes',
    async (_, Example) => {
      const view = render(() => <Example />)
      const thumb = view.getAllByRole('slider')[0]
      const initial = Number(thumb.getAttribute('aria-valuenow'))
      thumb.focus()
      fireEvent.keyDown(thumb, { key: 'ArrowRight' })
      await waitFor(() => expect(thumb).toHaveAttribute('aria-valuenow', String(initial + 1)))
      fireEvent.keyDown(thumb, { key: 'ArrowRight' })
      await waitFor(() => expect(thumb).toHaveAttribute('aria-valuenow', String(initial + 2)))
    },
  )

  it('edit CustomControls saves the edited value', async () => {
    const view = render(() => <CustomControls />)
    await user.click(view.getByText('Edit'))
    const input = await view.findByRole('textbox')
    fireEvent.input(input, { target: { value: 'Updated' } })
    await user.click(view.getByText('Save'))
    await waitFor(() => expect(view.getByText('Updated')).toBeVisible())
    expect(input).not.toBeVisible()
    await user.click(view.getByText('Edit'))
    await waitFor(() => expect(input).toBeVisible())
    expect(input).toHaveValue('Updated')
  })

  it('splitter RootProvider maximizes the seeded panel', async () => {
    const view = render(() => <RootProvider />)
    const [panel, second] = view.container.querySelectorAll<HTMLElement>('[data-part="panel"]')
    const initial = panel.getAttribute('style')
    expect(panel.style.flexGrow).toContain('50')
    expect(second.style.flexGrow).toContain('50')
    await user.click(view.getByRole('button', { name: 'Maximize a' }))
    await waitFor(() => expect(panel.getAttribute('style')).not.toBe(initial))
    expect(panel.style.flexGrow).toContain('100')
    expect(second.style.flexGrow).toBe('0')
  })
})
