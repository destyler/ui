import { render, screen } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { Tour, tourAnatomy, useTour } from '../'
import { getExports } from '../../../setup-test'

function ComponentUnderTest() {
  const tour = useTour({
    steps: [{ id: 'welcome', type: 'dialog', title: 'Welcome', description: 'Welcome to the tour' }],
  })

  return (
    <Tour.Root tour={tour}>
      <Tour.Context>
        {api => (
          <>
            <output>{api().open ? 'open' : 'closed'}</output>
            <button type="button" onClick={() => api().start()}>Start</button>
          </>
        )}
      </Tour.Context>
      <Tour.Positioner>
        <Tour.Content>
          <Tour.CloseTrigger>Close</Tour.CloseTrigger>
        </Tour.Content>
      </Tour.Positioner>
    </Tour.Root>
  )
}

describe('tour', () => {
  it.each(getExports(tourAnatomy))('exports %s', (part) => {
    expect(Tour[part]).toBeDefined()
  })

  it('starts through the context API', async () => {
    render(() => <ComponentUnderTest />)
    expect(screen.getByText('closed')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText('open')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'close tour' }))
    expect(screen.getByText('closed')).toBeInTheDocument()
  })
})
