import { render, screen } from '@solidjs/testing-library'
import { EnvironmentProvider, useEnvironmentContext } from '../'

function PrintEnvironment() {
  const environment = useEnvironmentContext()

  return <pre>{environment().getRootNode() === document ? 'document' : 'other'}</pre>
}

describe('environmentProvider', () => {
  it('should have access to the environment values', async () => {
    render(() => (
      <EnvironmentProvider value={() => document}>
        <PrintEnvironment />
      </EnvironmentProvider>
    ))
    expect(screen.getByText('document')).toBeInTheDocument()
  })
})
