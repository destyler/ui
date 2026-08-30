import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import { RadioGroup } from '../examples/RadioGroup'

describe('menu examples', () => {
  it('should update the radio group value', async () => {
    render(() => <RadioGroup />)

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    const solid = await screen.findByRole('menuitemradio', { name: 'Solid' })
    fireEvent.click(solid)

    await waitFor(() => expect(solid).toHaveAttribute('aria-checked', 'true'))
    expect(screen.queryByText('Svelte')).not.toBeInTheDocument()
  })
})
