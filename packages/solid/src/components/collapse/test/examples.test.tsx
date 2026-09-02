import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { ContextFocusedValue } from '../examples/ContextFocusedValue'
import { ContextGetItemState } from '../examples/ContextGetItemState'
import { ContextSetValue } from '../examples/ContextSetValue'
import { ContextValue } from '../examples/ContextValue'

describe('collapse context examples', () => {
  it('should reactively expose the focused value', async () => {
    render(() => <ContextFocusedValue />)

    screen.getByRole('button', { name: /what is vue/i }).focus()
    await waitFor(() => expect(screen.getByText(/focused item: vue/i)).toBeVisible())
  })

  it('should reactively expose item state', async () => {
    render(() => <ContextGetItemState />)

    expect(screen.getByText(/expanded: n/i)).toBeVisible()
    await user.click(screen.getByRole('button', { name: /what is vue/i }))
    await waitFor(() => expect(screen.getByText(/expanded: y/i)).toBeVisible())
  })

  it('should update value through the context API', async () => {
    render(() => <ContextSetValue />)

    await user.click(screen.getByRole('button', { name: 'Select Vue' }))
    expect(screen.getByRole('button', { name: /what is vue/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('should reactively expose the selected value', async () => {
    render(() => <ContextValue />)

    expect(screen.getByText(/selected items: react/i)).toBeVisible()
    await user.click(screen.getByRole('button', { name: /what is vue/i }))
    await waitFor(() => expect(screen.getByText(/selected items: vue/i)).toBeVisible())
  })
})
